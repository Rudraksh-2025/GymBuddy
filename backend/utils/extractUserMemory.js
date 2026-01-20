export const extractUserMemory = (text = "") => {
    const q = text.toLowerCase();

    const memories = [];

    // ---- DIET ----
    if (/vegetarian|veg diet|no meat/i.test(q)) {
        memories.push({ type: "diet", key: "vegetarian", value: "true" });
    }

    if (/no eggs|egg allergy|dont eat eggs/i.test(q)) {
        memories.push({ type: "diet", key: "no_eggs", value: "true" });
    }

    // ---- EXERCISE ----
    if (/hate running|dont like running|running is boring/i.test(q)) {
        memories.push({ type: "exercise", key: "hate_running", value: "true" });
    }

    if (/prefer home workout|no gym|workout at home/i.test(q)) {
        memories.push({ type: "preference", key: "home_workout", value: "true" });
    }

    // ---- INJURY ----
    if (/knee pain|knee injury|knee problem/i.test(q)) {
        memories.push({ type: "injury", key: "knee", value: "pain" });
    }

    if (/back pain|lower back/i.test(q)) {
        memories.push({ type: "injury", key: "back", value: "pain" });
    }

    // ---- SCHEDULE ----
    if (/morning workout|train in morning/i.test(q)) {
        memories.push({ type: "schedule", key: "workout_time", value: "morning" });
    }

    if (/night workout|evening gym/i.test(q)) {
        memories.push({ type: "schedule", key: "workout_time", value: "night" });
    }

    return memories;
};