import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";

export function getCreateBidSchema(joi) {
  return joi.object({
    name: joi.string().required().min(1).max(100).label("Name"),
    phone: joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (!isValidPhoneNumber(value, "AU")) {
          return helpers.error("any.invalid");
        }
        return parsePhoneNumber(value, "AU").formatInternational();
      })
      .label("Phone Number"),
    amount: joi.number().required().positive().label("Bid"),
    notifyOnChange: joi.boolean().default(false),
  });
}
