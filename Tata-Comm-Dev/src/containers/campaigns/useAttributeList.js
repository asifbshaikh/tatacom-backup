import axios from 'axios';
import { apiUrlNewV3, getHeaders } from 'helpers/ApiHelper';
import { useMemo, useState } from 'react';

const useAttributeList = () => {
  const [attributeList, setAttributeList] = useState([]);

  const getUserAttributes = (id) => {
    try {
      const method = 'get';
      axios[method](
        `${apiUrlNewV3()}segments/get_user_event_attributes?event_id=${id}`,
        {
          headers: getHeaders(),
        }
      ).then((res) => {
        setAttributeList(res.data.event_attributes);
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return { attributeList, getUserAttributes };
};

export default useAttributeList;
