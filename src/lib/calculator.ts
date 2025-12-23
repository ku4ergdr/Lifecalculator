export const TOTAL_YEARS = 80;
export const WEEKS_IN_YEAR = 52;
export const MONTHS_IN_YEAR = 12;

export type ViewMode = 'weeks' | 'months' | 'years';

export interface TimeUnit {
    isLived: boolean;
    isCurrent: boolean;
    index: number;
    yearIndex: number; // Approximate year logic for months/weeks
    label: string; // e.g., "Week 10", "Jan", "2024"
    startDate: Date;
    endDate: Date;
}

export interface LifeData {
    livedUnits: number;
    totalUnits: number;
    percentage: string;
    ageYears: number;
    units: TimeUnit[]; // Flat array for unified grid
    birthDate: Date;
    mode: ViewMode;
}

export const calculateLifeData = (birthDate: Date, mode: ViewMode = 'weeks'): LifeData | null => {
    if (!birthDate || isNaN(birthDate.getTime())) return null;

    const today = new Date();
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - birthDate.getTime();
    if (diffMs < 0) return null;

    // Basic stats
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        ageYears--;
    }

    let totalUnits = 0;
    let livedUnits = 0;
    const units: TimeUnit[] = [];

    if (mode === 'years') {
        totalUnits = TOTAL_YEARS;
        livedUnits = ageYears;

        for (let i = 0; i < totalUnits; i++) {
            const startDate = new Date(birthDate);
            startDate.setFullYear(birthDate.getFullYear() + i);
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            const isLived = i < livedUnits;
            const isCurrent = i === livedUnits;

            units.push({
                isLived,
                isCurrent,
                index: i,
                yearIndex: i,
                label: startDate.getFullYear().toString(),
                startDate,
                endDate
            });
        }

    } else if (mode === 'months') {
        totalUnits = TOTAL_YEARS * MONTHS_IN_YEAR;
        // Calculate full months lived
        const yearsDiff = today.getFullYear() - birthDate.getFullYear();
        const monthsDiff = today.getMonth() - birthDate.getMonth();
        livedUnits = yearsDiff * 12 + monthsDiff;
        if (today.getDate() < birthDate.getDate()) livedUnits--;

        for (let i = 0; i < totalUnits; i++) {
            const yearIndex = Math.floor(i / 12);
            const monthIndex = i % 12;

            const startDate = new Date(birthDate);
            startDate.setFullYear(birthDate.getFullYear(), birthDate.getMonth() + i, birthDate.getDate());

            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);

            const isLived = i < livedUnits;
            const isCurrent = i === livedUnits;

            // Month names
            const monthName = startDate.toLocaleDateString('ru-RU', { month: 'short' });

            units.push({
                isLived,
                isCurrent,
                index: i,
                yearIndex,
                label: `${monthName} ${startDate.getFullYear()}`,
                startDate,
                endDate
            });
        }

    } else {
        // WEEKS
        totalUnits = TOTAL_YEARS * WEEKS_IN_YEAR;
        const WEEK_MS = 1000 * 60 * 60 * 24 * 7;
        livedUnits = Math.floor(diffMs / WEEK_MS);

        for (let i = 0; i < totalUnits; i++) {
            const yearIndex = Math.floor(i / 52);

            const startDate = new Date(birthDate);
            startDate.setDate(birthDate.getDate() + (i * 7));
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            const isLived = i < livedUnits;
            const isCurrent = i === livedUnits;

            units.push({
                isLived,
                isCurrent,
                index: i,
                yearIndex,
                label: `Неделя ${i + 1}`,
                startDate,
                endDate
            });
        }
    }

    const percentage = Math.min((livedUnits / totalUnits) * 100, 100).toFixed(2);

    return {
        livedUnits,
        totalUnits,
        percentage,
        ageYears,
        units,
        birthDate,
        mode
    };
};
