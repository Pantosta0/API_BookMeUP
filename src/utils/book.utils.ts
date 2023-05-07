import { Book } from "../models/book.model";

export function orderBookByTrend(libros: Book[]) {
    libros.sort((a, b) => {
        // Verificar la cantidad de readingLists
        if (b.readingLists.length - a.readingLists.length !== 0) {
            return b.readingLists.length - a.readingLists.length;
        }


        // Verificar la cantidad de ranks
        if (b.ranks.length - a.ranks.length !== 0) {
            return b.ranks.length - a.ranks.length;
        }


        // Verificar el promedio de ranks
        const aPromedioRanks = a.ranks.length === 0 ? 0 : a.ranks.reduce((total, r) => total + r.score, 0) / a.ranks.length;
        const bPromedioRanks = b.ranks.length === 0 ? 0 : b.ranks.reduce((total, r) => total + r.score, 0) / b.ranks.length;
        if (bPromedioRanks - aPromedioRanks !== 0) {
            return bPromedioRanks - aPromedioRanks;
        }

        // Si llegamos a este punto, significa que los libros son iguales
        return 0;
    });

    return libros;
}