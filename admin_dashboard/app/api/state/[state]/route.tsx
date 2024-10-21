import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { state: string } }) {
  try { 
    const state = await prisma.states.findFirst({
      where: { statName: params.state },
    });

    if (!state) {
      return Response.json("State not found", { status: 404 });
    }

    return Response.json(state, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Failed to retrieve data", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { state: string } }) {
  try {
    const { state } = await request.json();
    
    const oldState = await prisma.states.findFirst({
      where: { statName: params.state },
    });

    if (!oldState) {
      return Response.json("State not found", { status: 404 });
    }

    if (detectType(state) !== oldState.statType) {
      return Response.json("Type mismatch", { status: 400 });
    }

    const updatedState = await prisma.states.update({
      where: { statName: params.state },
      data: { statValue: state },
    });

    if (!updatedState) {
      return Response.json("State not found", { status: 404 });
    }

    return Response.json(updatedState, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Failed to update data", { status: 500 });
  }
}

// // // // // // // // //
//  AUXILIARY FUNCTIONS //
// // // // // // // // //

function detectType(s: string): string {
  // Check if the string is a valid integer
  if (!isNaN(Number(s)) && Number.isInteger(parseFloat(s))) {
    return "integer";
  }

  // Check if the string is a valid float (with dot as decimal separator)
  if (!isNaN(Number(s)) && !Number.isInteger(parseFloat(s))) {
    return "float";
  }

  // Check for boolean values
  if (s.toLowerCase() === "true" || s.toLowerCase() === "false") {
    return "boolean";
  }

  // If none of the above, treat it as a regular string
  return "string";
}
