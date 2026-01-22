export const extractDateFromText = (text = "") => {
    const q = text.toLowerCase();

    // match: 24 jan, 24th jan, jan 24, january 24
    const regex =
        /(\d{1,2})(st|nd|rd|th)?\s*(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)/i;

    const match = q.match(regex);

    if (!match) return null;

    const day = parseInt(match[1]);

    const monthMap = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, sept: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11,
    };

    const month = monthMap[match[3].slice(0, 3)];

    const year = new Date().getFullYear();

    const start = new Date(year, month, day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(year, month, day);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};
