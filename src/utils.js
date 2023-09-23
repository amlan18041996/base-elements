import { ref, computed } from "vue";

export default function () {
    function truncateText(text, length, clamp) {
        clamp = clamp || '...';
        return text.length > length ? text.slice(0, length) + clamp : text;
    }

    function amountToCurrency(locale, style, currencyName, maximumFraction=0, amount) {
        return new Intl.NumberFormat(
            locale, 
            {
              style: style, 
              currency: currencyName, 
              maximumFractionDigits: maximumFraction
            }
        ).format(amount);
    }

    function paginateList(totalItems, currentPage, perPageItems) {
        let paginate = {dotted: [], pages: 0, striped: []}
        paginate.pages = Math.ceil(totalItems.length/perPageItems);
        paginate.dotted = Array.from({length: paginate.pages}, (_, i) => i+1).map(x => {
            if (
                x <= 3 || 
                x >= paginate.pages - 2 || 
                (x >= currentPage - 1 && x <= currentPage + 1)
            ) {
                return x;
            } else if (
                currentPage === (x - 2) || 
                currentPage === (x + 2) || 
                (currentPage === 1 && x === (currentPage+3))
            ) {
                return '...';
            }
        }).filter(Boolean);
        paginate.striped = totalItems.slice(((currentPage - 1) * perPageItems), (currentPage * perPageItems));
        return paginate;
    }

    return {truncateText, amountToCurrency, paginateList}
}