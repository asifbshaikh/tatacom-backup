import React, { useState, useEffect } from 'react';
// import { injectIntl } from 'react-intl';
import ReactAutoSuggest from 'components/common/ReactAutoSuggest';
// import cakes from 'data/cakes';

// const data = cakes.map((item) => {
//   return { name: item.title };
// });


import axios from 'axios';
import { apiUrlBase } from 'helpers/ApiHelper';

const ReactAutoSugegstExample = () => {
  const [value, setValue] = useState('');
  const [isLoaded, setIsLoaded] = useState('');
  const [data, setData] = useState([]);





  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `${apiUrlBase()}/api/v1/accounts/3/contacts/search?include_contact_inboxes=false&page=1&sort=name&q=${value}`,
          {
            headers: {
              'access-token': 'xB02A7b5BCX6DDjppPSB2g',
              'uid': 'ankur.jain@tatacommunications.com',
              'token-type': 'Bearer',
              'client': 'unA7nxWGaPFEK9-n8UUZAg',
              'expiry': '1672805342',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .then(({ meta, payload }) => {
          // {meta: {}, payload: [{}]}

          const dataToSend = payload.map((item) => {
            return  { name: item.name, email: item.email, id: item.id };
          });
          setData(dataToSend);
          setIsLoaded(true);
        }).catch((e) => {
          // error
        });
    }
    fetchData();
  }, [value]);


  return (
    <ReactAutoSuggest
      placeholder="Start Typing"
      value={value}
      onChange={(val) => setValue(val)}
      data={data}
      getSuggestionValue= {(suggestion) => suggestion.name}
      onSuggestionSelected={() => {}
    }
      renderSuggestion={(suggestion) => <div>{suggestion.name} {suggestion.email}</div>}
    />
  );
};

export default ReactAutoSugegstExample;
