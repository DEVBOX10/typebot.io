import type { GoogleSheetsInsertRowOptions } from "@typebot.io/blocks-integrations/googleSheets/schema";
import type { SessionState } from "@typebot.io/chat-session/schemas";
import type { ChatLog } from "../../../schemas/api";
import type { ExecuteIntegrationResponse } from "../../../types";
import { getAuthenticatedGoogleDoc } from "./helpers/getAuthenticatedGoogleDoc";
import { parseNewRowObject } from "./helpers/parseNewRowObject";

export const insertRow = async (
  state: SessionState,
  {
    outgoingEdgeId,
    options,
  }: { outgoingEdgeId?: string; options: GoogleSheetsInsertRowOptions },
): Promise<ExecuteIntegrationResponse> => {
  const { variables } = state.typebotsQueue[0].typebot;
  if (!options.cellsToInsert || !options.sheetId) return { outgoingEdgeId };

  const logs: ChatLog[] = [];

  const doc = await getAuthenticatedGoogleDoc({
    credentialsId: options.credentialsId,
    spreadsheetId: options.spreadsheetId,
    workspaceId: state.workspaceId,
  });

  const parsedValues = parseNewRowObject(variables)(options.cellsToInsert);

  try {
    await doc.loadInfo();
    const sheet = doc.sheetsById[Number(options.sheetId)];
    await sheet.addRow(parsedValues);
    logs.push({
      status: "success",
      description: `Succesfully inserted row in ${doc.title} > ${sheet.title}`,
    });
  } catch (err) {
    logs.push({
      status: "error",
      description: `An error occured while inserting the row`,
      details: err,
    });
  }

  return { outgoingEdgeId, logs };
};
