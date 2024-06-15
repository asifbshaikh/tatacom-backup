import React, { useEffect, useState } from 'react';

const Counter = ({ totalCount, duration = 1 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const step = totalCount / (duration * 1000);

    const counterInterval = setInterval(() => {
      if (count < totalCount) {
        setCount((previousCount) => previousCount + step);
      } else {
        clearInterval(counterInterval);
      }
    }, 1);
    return () => {
      clearInterval(counterInterval);
    };
  }, [count, totalCount, duration]);

  return <h2 className="font-weight-bold">{Math.round(count)}</h2>;
};

export default React.memo(Counter);
