import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { injectIntl } from 'react-intl';

const ReactAutoSuggestCustom = ({
  data,
  value,
  placeholder,
  onChange,
  onSuggestionSelected,
  getSuggestionValue,
  renderSuggestion,
  intl,
}) => {
  const [valueState, setValueState] = useState(value);
  const dataState = data || [];
  const [suggestions, setSuggestions] = useState([]);
  const { messages } = intl;
  const getSuggestions = () => {
    return dataState;
  };

  const changeInput = (event, { newValue }) => {
    setValueState(newValue);
    onChange(newValue);
  };

  const onSuggestionsFetchRequested = ({ value: val }) => {
    setSuggestions(getSuggestions(val));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const inputProps = {
    placeholder: messages[placeholder] || '',
    value: valueState,
    onChange: changeInput,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      onSuggestionSelected={onSuggestionSelected}
      theme={{
        container: 'autosuggest',
        input: 'form-control',
        inputOpen: 'react-autosuggest__input--open',
        suggestionsContainer: 'react-autosuggest__suggestions-container',
        suggestionsContainerOpen:
          'react-autosuggest__suggestions-container--open',
        suggestionsList: `react-autosuggest__suggestions-list ${
          suggestions.length ? 'show' : ''
        }`,
        suggestionFocused: 'active',
        suggestion: 'react-autosuggest__suggestion',
      }}
    />
  );
};

export default injectIntl(ReactAutoSuggestCustom);
