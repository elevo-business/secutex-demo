import * as chain from "./chain.js";

export async function extract({ subject, from, body, mailId }) {
  return chain.run({ subject, from, body, mailId });
}
