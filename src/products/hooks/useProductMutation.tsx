import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as productActions from "../services/actions";
import { Product } from '../interfaces/product';

export const useProductMutation = () => {
    const queryClient = useQueryClient();
    const productMutation = useMutation({
        mutationFn: productActions.createProduct,
        onMutate: (result) => {
            console.log('Mutando - Optimitic updated')

            const optimisticProduct = { id: Math.random(), ...result };
            console.log({ optimisticProduct })

            // Set product create
            queryClient.setQueriesData<Product[]>(
                { queryKey: ['products', { 'filterKey': result.category }] },
                (old) => {
                    if (!old) return [optimisticProduct];
                    return [...old, optimisticProduct]
                }
            )
            return {
                optimisticProduct
            }
        },
        onSuccess: (result, variables, context) => {
            // Option 1
            // New query to bd 
            // queryClient.invalidateQueries({
            //     queryKey: ['products', { 'filterKey': result.category }]
            // })

            // Option 2
            console.log('Product Create...')
            console.log({ result, variables, context })

            // Remove id invalid
            queryClient.removeQueries({
                queryKey: ['products', context.optimisticProduct.id]
            })

            // Set product create
            queryClient.setQueriesData<Product[]>(
                { queryKey: ['products', { 'filterKey': result.category }] },
                (old) => {
                    if (!old) return [result];
                    //return [...old,result]
                    return old.map(cacheProduct => {
                        return cacheProduct.id === context.optimisticProduct.id ? result : cacheProduct
                    })
                }
            )

        },
        onError: (result, variables, context) => {
            console.log('Product Create Error ...')
            console.log({ result, variables, context })
            // Remove id invalid
            queryClient.removeQueries({
                queryKey: ['products', context?.optimisticProduct.id]
            })

            // Set product create
            queryClient.setQueriesData<Product[]>(
                { queryKey: ['products', { 'filterKey': variables.category }] },
                (old) => {
                    if (!old) return [];
                    return old.filter(cacheProduct => {
                        return cacheProduct.id !== context?.optimisticProduct.id 
                    })
                }
            )

        }
    })

    return {
        productMutation
    }
}
