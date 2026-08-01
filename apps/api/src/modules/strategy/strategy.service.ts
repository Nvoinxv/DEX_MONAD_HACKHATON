import type {
  Strategy,
  StrategyPayload,
} from "../strategy/strategy_main";

const API_URL = process.env.VITE_API_URL;

export async function getStrategies(): Promise<Strategy[]> {
  const response = await fetch(
    `${API_URL}/strategies`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch strategies");
  }

  const result = await response.json();

  return result.data;
}

export async function createStrategy(
  payload: StrategyPayload
): Promise<Strategy> {
  const response = await fetch(
    `${API_URL}/strategies/create`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create strategy");
  }

  const result = await response.json();

  return result.data;
}