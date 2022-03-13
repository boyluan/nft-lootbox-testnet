import quizQuestions from "../../lib/questions";
import type { NextApiRequest, NextApiResponse } from "next";

import { ethers, BigNumber } from "ethers";

import { packAddress } from "../../lib/contractAddresses";

import { ThirdwebSDK } from "@3rdweb/sdk";

// import Debug from "debug";

export type CheckAnswerPayload = {
  questionIndex: number;
  answerIndex: number;
  message: string;
  signedMessage: string;
};

type ErrorResponse = {
  kind: "error";
  error: string;
};

type IncorrectResponse = {
  kind: "incorrect";
  correctAnswerIndex: number;
};

type CorrectResponse = {
  kind: "correct";
};

export type CheckAnswerResponse =
  | ErrorResponse
  | IncorrectResponse
  | CorrectResponse;

export default async function Open(
  req: NextApiRequest,
  res: NextApiResponse<CheckAnswerResponse>
) {
  // Validate the request body contains expected fields
  if (!req.body.hasOwnProperty("questionIndex")) {
    res.status(400).json({
      kind: "error",
      error: "No question index in request body",
    });
    return;
  }

  if (!req.body.hasOwnProperty("answerIndex")) {
    res.status(400).json({
      kind: "error",
      error: "No answer index in request body",
    });
    return;
  }

  // const debug = Debug("AppName"); {{ DEFUNCT }}

  const body = req.body as CheckAnswerPayload;

  // We need to get the address that signed 'message' to produce 'signedMessage'
  // The 'ethers' library provides a utility function for dealing with this
  let address = ""
    try {
      // 'ethers.utils.verifyMessage' takes a message and signature (contd. below)
      // And returns the address that signed the message, to product the signature
      // If 'signedMessage' is not a valid signature, then it will throw an error
      address = ethers.utils.verifyMessage(body.message, body.signedMessage)
    } catch (err) {
      res.status(400).json({
        kind: "error",
        error: `Unable to verify message: ${err}`,
      });
      return;
    }

  // Validate the question index is valid
  if (body.questionIndex >= quizQuestions.length) {
    res.status(400).json({
      kind: "error",
      error: `Invalid question index ${body.questionIndex}`,
    });
    return;
  }

  const question = quizQuestions[body.questionIndex];

  // Check the answer, return if incorrect
  if (body.answerIndex !== question.correctAnswerIndex) {
    res.status(200).json({
      kind: "incorrect",
      correctAnswerIndex: question.correctAnswerIndex as number,
    });
    return;
  }

  // If we get here then the answer was correct

  // TODO: send the reward!

  // Initialize the Thirdweb SDK using the private key that owns the wallet
  const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY as string,
      // Using Polygon Mumbai network
      // ethers.getDefaultProvider("https://rpc-mumbai.matic.today")
      ethers.getDefaultProvider("https://winter-icy-sun.matic-testnet.quiknode.pro/f36aa318f8f806e4e15a58ab4a1b6cb9f9e9d9b9/")
    ),
  );

  // Transfer a copy of the pack to the user
  console.log(`Transferring a pack to ${address}...`);
  const packModule = sdk.getPackModule(packAddress);
  const packTokenId = '0';
  // Note that this is async
  // We initialize a transfer by calling the code in Line: 116
  // And then we return a correct response to the user
  // Note that this works because the account associated with 'WALLET_PRIVATE_KEY' (contd. below)
  // It owns all instances of the packs, so it can transfer one to the user
  packModule.transfer(address, packTokenId, BigNumber.from(1));

  res.status(200).json({
    kind: "correct",
  });
}
