import { useQuery } from "@tanstack/react-query";
import * as productActions from "../services/actions";


interface Options {
    id: number;
}


export const useProduct = ({ id }: Options) => {
    const { isLoading, isError, error, data: product, isFetching } = useQuery(
        {
            queryKey: ['product', id],
            queryFn: () => productActions.getProductById({ id }),
            staleTime: 1000 * 60 * 60, // 1 hour 
            refetchOnWindowFocus: false,
        }
    );
    return { 
        error, 
        isError, 
        isFetching, 
        isLoading, 
        product, 
    }
}
