import { Switch } from "@headlessui/react";
import Joi from "joi";
import axios from "axios";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { classNames } from "../../lib/utils/class-names";
import { useAuctionContext } from "../../lib/context/auction";
import { getCreateBidSchema } from "../../lib/services/bid";
import { useEffect, useState } from "react";
import { formatCentsToDollars } from "../../lib/money/format";
import { useSWRConfig } from "swr";
import SuccessModal from "./SuccessModal";

const createBidSchema = getCreateBidSchema(Joi);

export default function AuctionForm({ story }) {
  const { mutate } = useSWRConfig();
  const { id, storyblokUuid, startingBid, bids } = useAuctionContext();

  const highestBidAmount = bids.length > 0 ? bids[0].amount : 0;
  const recommendedBidAmount =
    highestBidAmount > 0
      ? highestBidAmount + 1000 // + $10
      : startingBid;

  const defaultAmount = (recommendedBidAmount / 100).toFixed(2);

  const [showSuccess, setShowSuccess] = useState(false);
  const [shouldNotify, setShouldNotify] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: joiResolver(createBidSchema),
    defaultValues: {
      amount: defaultAmount,
      phone: localStorageGet("phone"),
      name: localStorageGet("name"),
    },
  });

  useEffect(() => {
    const value = localStorageGet("shouldNotify");
    setShouldNotify(value === null ? true : value);
  }, []);

  function onSubmit(data) {
    clearErrors("api"); // Generic API errors

    return axios
      .post(`/api/auction-item/${id}/bid`, {
        ...data,
        amount: data.amount * 100,
        notifyOnChange: shouldNotify,
      })
      .then(() => {
        // Store data in localstorage
        localStorageSet("name", data.name);
        localStorageSet("phone", data.phone);
        localStorageSet("shouldNotify", shouldNotify);

        // Tell SWR that this data has changed
        return mutate(`/api/storyblok/auction-item/${storyblokUuid}`).then(() =>
          setShowSuccess(true)
        );
      })
      .catch((error) => {
        setError("api", { type: "custom", message: error.response.data });
      });
  }

  const inputBid = watch("amount") ?? defaultAmount;
  const formattedInputBid = inputBid
    ? Number(inputBid).toLocaleString("en-AU", {
        style: "currency",
        currency: "AUD",
      })
    : null;

  return (
    <>
      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
          }}
        />
      )}
      <form
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              autoComplete="name"
              disabled={isSubmitting}
              className={classNames(
                "py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md",
                isSubmitting && "bg-gray-50"
              )}
              {...register("name")}
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label
            htmlFor="phone-number"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <label htmlFor="country" className="sr-only">
                Country
              </label>
              <select
                id="country"
                name="country"
                className="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option>AU</option>
              </select>
            </div>
            <input
              type="tel"
              id="phone-number"
              autoComplete="tel"
              disabled={isSubmitting}
              className={classNames(
                "py-3 px-4 block w-full pl-20 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md",
                isSubmitting && "bg-gray-50"
              )}
              placeholder="04"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <div className="flex justify-between">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Bid
            </label>
            <div className="block text-sm font-medium text-indigo-700">
              {highestBidAmount > 0 && (
                <span>
                  Current winning bid: {formatCentsToDollars(highestBidAmount)}
                </span>
              )}
              {highestBidAmount === 0 && <span>No bids yet</span>}
            </div>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              step="any"
              disabled={isSubmitting}
              className={classNames(
                "focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 pl-7 pr-12 sm:text-sm border-gray-300 rounded-md",
                isSubmitting && "bg-gray-50"
              )}
              placeholder="0.00"
              aria-describedby="price-currency"
              {...register("amount", {
                valueAsNumber: true,
              })}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                AUD
              </span>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Switch
                checked={shouldNotify}
                onChange={setShouldNotify}
                className={classNames(
                  shouldNotify ? "bg-indigo-600" : "bg-gray-200",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                )}
              >
                <span className="sr-only">Notify me if my bid is beaten</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    shouldNotify ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </div>

            <div className="ml-3">
              <p className="text-base text-gray-500">
                Notify me if my bid is overtaken
              </p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Terms and conditions
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul role="list" className="list-disc pl-5 space-y-1">
                  {story.delivery_terms && story.delivery_terms.length > 0 ? (
                    <li>{story.delivery_terms}</li>
                  ) : (
                    <li>
                      Pickup in Fitzroy North, or delivery available at an
                      addition cost based on your location and the item's
                      dimensions, weight, and value
                    </li>
                  )}
                  <li>
                    Pay by donation to specified fund (we&apos;ll text you if
                    you win)
                  </li>
                  <li>
                    Pay within the hour or your item will pass to the next
                    person
                  </li>
                  <li>No returns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          {errors.api && <p className="text-red-500">{errors.api.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={classNames(
              "w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              isSubmitting && "bg-gray-500 hover:bg-gray-500"
            )}
          >
            {!errors.amount && formattedInputBid
              ? `Submit bid for ${formattedInputBid}`
              : "Submit bid"}
          </button>
        </div>
      </form>
    </>
  );
}

function localStorageGet(key) {
  return typeof window !== "undefined"
    ? JSON.parse(window.localStorage.getItem(key))
    : null;
}

function localStorageSet(key, data) {
  return typeof window !== "undefined"
    ? window.localStorage.setItem(key, JSON.stringify(data))
    : null;
}
