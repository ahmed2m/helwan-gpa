import React, { useReducer, createContext, useEffect } from "react";
import Types from "../types";

var uuid = require("uuid");

const localState = JSON.parse(localStorage.getItem(Types.MODULE_NAME));

export const Context = createContext();

let initialSubjects = Array.apply(null, Array(6)).map(() => {
  return {
    grade: String(),
    checked: false,
    key: uuid.v4(),
  };
});

const initialState = {
  subjects: initialSubjects,
};

const reducer = (state, action) => {
  switch (action.type) {
    case Types.ADD_SUBJECT:
      return { subjects: [...state.subjects, action.payload] };
    case Types.EDIT_SUBJECT:
      return {
        subjects: state.subjects.map((subject) =>
          subject.key === action.payload.key
            ? {
                ...subject,
                grade: action.payload.grade,
                checked: action.payload.checked,
              }
            : subject
        ),
      };
    case Types.DEL_SUBJECT:
      return {
        subjects: state.subjects.filter(
          (subject) => subject.key !== action.payload
        ),
      };
    case Types.LISTING_START:
      return {
        loading: true,
      };
    case Types.LISTING_END:
      return {
        loading: false,
      };
    case Types.CLEAR_SUBJECTS:
      localStorage.removeItem(Types.MODULE_NAME);
      return { subjects: initialState.subjects };
    default:
      throw new Error();
  }
};

export const SubjectsContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, localState ?? initialState);
  const { Provider } = Context;

  useEffect(() => {
    localStorage.setItem(Types.MODULE_NAME, JSON.stringify(state));
  }, [state]);

  return <Provider value={[state, dispatch]}>{props.children}</Provider>;
};
