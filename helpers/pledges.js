import { sortBy, last } from 'lodash-es'

export const getMinimumBid = (pledges) => Number(last(sortBy(pledges, function(pledge) {
    return Number(pledge.content.amount)
}))?.content.amount)
