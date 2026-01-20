import { INTENTS } from "./intents.js";

export const detectIntent = (text = "") => {
    const q = text.toLowerCase().trim();

    /* ---------- GREETING ---------- */
    if (
        /^(hi|hello|hey|yo|hii|hiii|good morning|good evening|good afternoon)\b/i.test(q)
    ) {
        return INTENTS.GREETING;
    }

    /* ---------- DIET TODAY ---------- */
    if (
        /(what.*eat|what should i eat|diet today|today.*meal|today.*diet)/i.test(q)
    ) {
        return INTENTS.DIET_TODAY;
    }

    /* ---------- MEAL SUGGESTION ---------- */
    if (
        /(suggest.*meal|meal ideas|healthy food|protein food|low calorie food)/i.test(
            q
        )
    ) {
        return INTENTS.MEAL_SUGGEST;
    }

    /* ---------- WORKOUT PLAN ---------- */
    if (
        /(workout plan|gym plan|weekly workout|split routine|training plan)/i.test(q)
    ) {
        return INTENTS.WORKOUT_PLAN;
    }

    /* ---------- WORKOUT TODAY ---------- */
    if (
        /(what.*workout today|train today|which muscle today|today.*gym)/i.test(q)
    ) {
        return INTENTS.WORKOUT_TODAY;
    }

    /* ---------- PROGRESS CHECK ---------- */
    if (
        /(am i doing well|progress|plateau|not losing|not gaining|how am i doing)/i.test(
            q
        )
    ) {
        return INTENTS.PROGRESS_CHECK;
    }

    /* ---------- MOTIVATION ---------- */
    if (
        /(motivate|feeling lazy|no motivation|tired of gym|skip workout)/i.test(q)
    ) {
        return INTENTS.MOTIVATION;
    }

    return INTENTS.GENERAL;
};