//one year from now millisecond value
export const oneYearfromNow=()=>
    new Date(Date.now()+365*24*60*60*1000);


// thirty days from now millisecond value

export const thirtyDaysFromNow=()=>
    new Date(Date.now()+30*24*60*60*1000);


//fifteen minutes from now millisecond value

export const fifteenMinutesFromNow=()=>
    new Date(Date.now()+15*1000);

//one day in milliseconds

export const ONE_DAY_MS=24*60*60*1000

export const fiveMinutesAgo=()=>
    new Date(Date.now()-5*60*1000);

export const oneHourFromNow=()=>
    new Date(Date.now()+60*60*1000);