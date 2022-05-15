import Vonage from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: "cf7c7af7",
  apiSecret: process.env.VONAGE_API_SECRET,
});

const from = "Open Mess";

export function sendSms(phone, body) {
  if (!process.env.VONAGE_API_SECRET) {
    throw new Error("SMS support not enabled, missing env variable");
  }

  return new Promise((resolve, reject) => {
    vonage.message.sendSms(from, phone, body, (error, responseData) => {
      if (error) {
        reject(error);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          resolve(responseData);
        } else {
          reject(responseData.messages[0]["error-text"]);
        }
      }
    });
  });
}
