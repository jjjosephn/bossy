// Calculate average rating
export const calculateAverageRating = (reviews: Array<{ rating: number }>): number => {
   return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
 }
 
 // Calculate rating distribution
 export const calculateRatingDistribution = (reviews: Array<{ rating: number }>): number[] => {
   const distribution = [0, 0, 0, 0, 0] // For ratings 1-5
   reviews.forEach((review) => {
     distribution[review.rating - 1]++
   })
   return distribution
 }
 
 // Calculate percentage for each rating
 export const calculateRatingPercentages = (distribution: number[], totalReviews: number): number[] => {
   return distribution.map((count) => (count / totalReviews) * 100)
 }
 
 