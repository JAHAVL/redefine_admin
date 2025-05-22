import { useState, useEffect } from 'react';
import { useScheduler } from '../context';
import { Series } from '../types';

/**
 * Custom hook for working with series data
 * Provides filtering and sorting capabilities
 */
export const useSeriesFilter = () => {
    const { state } = useScheduler();
    const [filteredSeries, set_filtered_series] = useState<Series[]>([]);
    const [search_term, set_search_term] = useState<string>('');
    const [sort_by, set_sort_by] = useState<'date' | 'name'>('date');
    const [sort_order, set_sort_order] = useState<'asc' | 'desc'>('desc');
    
    // Apply filters and sorting whenever dependencies change
    useEffect(() => {
        let result = [...state.series];
        
        // Apply search term filter
        if (search_term) {
            const search_lower: string = search_term.toLowerCase();
            result = result.filter((series: Series) => 
                series.series_name.toLowerCase().includes(search_lower) || 
                (series.description && series.description.toLowerCase().includes(search_lower))
            );
        }
        
        // Apply sorting
        result.sort((a: Series, b: Series) => {
            if (sort_by === 'date') {
                const date_a: number = new Date(a.start_date).getTime();
                const date_b: number = new Date(b.start_date).getTime();
                return sort_order === 'asc' ? date_a - date_b : date_b - date_a;
            } else {
                const name_a: string = a.series_name.toLowerCase();
                const name_b: string = b.series_name.toLowerCase();
                return sort_order === 'asc' 
                    ? name_a.localeCompare(name_b) 
                    : name_b.localeCompare(name_a);
            }
        });
        
        set_filtered_series(result);
    }, [state.series, search_term, sort_by, sort_order]);
    
    return {
        filtered_series: filteredSeries,
        set_search_term,
        set_sort_by,
        set_sort_order,
        search_term,
        sort_by,
        sort_order
    };
};
