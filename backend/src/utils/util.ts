// Contains any functions associated with backend

import { WithId } from "mongodb";
import { TDatabaseTaskProps } from "./types";

// This function simply renames the keys so that the keys coming from the database would be the same as the keys in the client
export function modifyData(rawData: WithId<TDatabaseTaskProps>[]) {
  const modifiedData = rawData.map((rawData: TDatabaseTaskProps) => ({
    _id: rawData._id,
    TaskName: rawData.name,
    TaskDeadline: rawData.deadline,
    TaskDescription: rawData.description,
    isFinished: rawData.isFinished,
  }));
  return modifiedData;
}
