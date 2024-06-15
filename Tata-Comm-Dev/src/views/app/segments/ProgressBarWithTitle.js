import React from 'react';
import { Progress } from 'reactstrap';

const ProgressBarWithTitle = ({
  title = '',
  percent = 0,
  total = 0,
  outOfValue = 0
}) => {
  return (
    <>
      <div>
        <p>{title}
          <span className="float-right text-muted">
            {`${outOfValue}/${total}`}
          </span>
        </p>
        <div>
          <Progress
            className="my-3"
            style={{
              height: '3px'
            }}
            value={percent}
          />
        </div>
      </div>
    </>
  );
};
export default ProgressBarWithTitle;
