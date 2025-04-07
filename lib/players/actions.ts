"use server";

import { z } from "zod";
import { randomBytes } from "crypto";
import database from "@/lib/database";

// Validation schema for player creation
const PlayerSchema = z.object({
  firstName: z.string().min(2).max(25).trim(),
  lastName: z.string().min(2).max(25).trim(),
});

// Generate a random, unique access code
async function generateUniqueAccessCode(length: number = 8): Promise<string> {
  // Create a random string using crypto
  const randomString = randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
  
  // Check if the code is already used
  const existingUser = await database.user.findUnique({
    where: { accessCode: randomString },
    select: { id: true },
  });

  // If it exists, generate a new one recursively
  if (existingUser) {
    return generateUniqueAccessCode(length);
  }

  return randomString;
}

// Function to create a new player
export async function createPlayerAction(data: { 
  firstName: string;
  lastName: string;
}) {
  try {
    // Validate the input data
    const validatedData = PlayerSchema.safeParse(data);
    
    if (!validatedData.success) {
      return {
        error: "Invalid player information. Please check your inputs.",
      };
    }

    const { firstName, lastName } = validatedData.data;
    const name = `${firstName} ${lastName}`;

    // Generate a unique access code
    const accessCode = await generateUniqueAccessCode();

    // Create the player in the database
    const newPlayer = await database.user.create({
      data: {
        name,
        accessCode,
        // Create an initial status for the player
        statuses: {
          create: {
            status: "LOGGED_OUT",
          },
        },
      },
    });

    // Return success and the access code
    return {
      success: true,
      accessCode,
      playerId: newPlayer.id,
    };
  } catch (error) {
    console.error("Player creation error:", error);
    return {
      error: "Failed to create player. Please try again.",
    };
  }
}

// Function to get all players
export async function getAllPlayersAction() {
  try {
    const players = await database.user.findMany({
      include: {
        statuses: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      players
    };
  } catch (error) {
    console.error("Error fetching players:", error);
    return {
      error: "Failed to fetch players"
    };
  }
}

// Function to delete a player
export async function deletePlayerAction(playerId: string) {
  try {
    await database.user.delete({
      where: {
        id: playerId
      }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting player:", error);
    return {
      error: "Failed to delete player"
    };
  }
}