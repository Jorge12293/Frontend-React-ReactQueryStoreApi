import { useQueryClient } from "@tanstack/react-query";
import * as productActions from "../services/actions";

export const usePrefetchProduct = () => {

    const queryClient = useQueryClient();

    const preFetchProduct = (id:number) => {

        queryClient.prefetchQuery({
            queryKey: ['product', id],
            queryFn: () => productActions.getProductById({ id }),
            staleTime: 1000 * 60 * 60, // 1 hour 
        })
    
    }
    return {
        preFetchProduct
    }
}
