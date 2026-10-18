import Constants from "expo-constants";

// Expo knows the address of the computer running Metro (e.g. "192.168.1.23:8081").
// The backend runs on the same computer, on port 3000.
const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

export const API_URL = `http://${host}:3000/api`;