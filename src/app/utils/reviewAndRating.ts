const reviews=(events:any)=>{
    events.map((event:any) => {
    const avgRating =
      event.reviews.length > 0
        ? event.reviews.reduce((sum:number, r:number) => sum + r.rating, 0) /
          event.reviews.length
        : null;
    const totalReviews = event.reviews.length;

    return {
      ...event,
      avgRating: avgRating || 0,
      totalReviews: totalReviews || 0,
    };
  });
}