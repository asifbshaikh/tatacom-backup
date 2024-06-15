import ContactsEnums from 'enums/contacts/contactsEnums';

export const handleAppliedContactFilter = (value) => {
  const { query } = value;
  const payload = [];
  for (let i = 0; i < query.payload.length; i++) {
    if (i > 0) {
      payload[i - 1].query_operator = query.payload[i].separators.value;
    }
    payload.push({
      attribute_key: query.payload[i].filter1.value,
      filter_operator: query.payload[i].filter2.value,
      values:
        query.payload[i].filter1.value === ContactsEnums.COUNTRY
          ? [query.payload[i].text.value]
          : [query.payload[i].text],
      ...(i === 0 && {
        attribute_model: ContactsEnums.STANDARD,
      }),
    });
  }
  return payload;
};
