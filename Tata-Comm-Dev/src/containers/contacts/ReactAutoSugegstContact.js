import React, { useState, useEffect } from 'react';
import ReactAutoSuggestCustom from 'components/common/ReactAutoSuggestCustom';
import { useDispatch, useSelector } from 'react-redux';
import { getContactsList } from 'redux/actions';

const ContactCard = ({ editFormData }) => {
  return (
    <div className="d-flex flex-row">
      <div className="pl-3 pr-2">
        <div className="font-weight-medium mb-0">
          {editFormData?.name}
          <span className="float-rightaa ml-1">(ID: {editFormData?.id})</span>
        </div>
        <div className="text-muted mb-0 text-small">
          <i className="simple-icon-envelope" /> {` `}
          {editFormData?.email}
        </div>
      </div>
    </div>
  );
};

const ReactAutoSugegstContact = ({ onSuggestionSelected, currentContact }) => {
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { contactsList } = useSelector((state) => state.contactsApp);

  useEffect(() => {
    if (value) {
      const params = {
        search: value,
        listingFilter: { labels: 'all' },
        currentPage: 1,
        selectedOrderOptionDir: {
          column: 'name',
        },
        selectedOrderOption: { column: 'name' },
      };
      dispatch(getContactsList(params));
    }
  }, [value]);

  useEffect(() => {
    if (contactsList?.payload) {
      // exclude current contact
      const dataToSend = [];
      contactsList?.payload.forEach((item) => {
        if (item.id !== currentContact.id) {
          dataToSend.push({ name: item.name, email: item.email, id: item.id });
        }
      });
      setData(dataToSend);
    }
  }, [contactsList]);

  return (
    <ReactAutoSuggestCustom
      placeholder="CONTACTS_PAGE.AUTO_SUGGEST.PLACEHOLDER"
      value={value}
      onChange={(val) => setValue(val)}
      data={data}
      getSuggestionValue={(suggestion) => suggestion.name}
      onSuggestionSelected={(e, params) => {
        onSuggestionSelected(e, params);
      }}
      renderSuggestion={(suggestion) => (
        <div>
          <ContactCard editFormData={suggestion} />
        </div>
      )}
    />
  );
};

export default ReactAutoSugegstContact;
