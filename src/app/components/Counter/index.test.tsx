import React from 'react';
import { render, screen } from '@testing-library/react';
import { CBS_KEY } from '../../utils/pageVisits';
import {axe, toHaveNoViolations} from 'jest-axe';
import Counter from '.';

expect.extend(toHaveNoViolations);

interface StoreType {
  [index: string]: string;
};

var localStorageMock = (function() {
  var store: StoreType = {};
  return {
    getItem: function(key: string) {
      return store[key];
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe("<Counter>", () => {
  test('snapshot', () => {
    const {container} = render(
      <Counter>
        <div>child text</div>
      </Counter>
    );
    expect(container).toMatchSnapshot();
  });
  test('renders children', () => {
    const childText = "child component";
    render(
      <Counter>
        <div>{childText}</div>
      </Counter>
    );
    const textElement = screen.getByText(childText);
    expect(textElement).toBeInTheDocument();
  });
  test('accessibility', async () => {
    const {container} = render(
      <Counter>
       child text
      </Counter>
    );
    expect(await axe(container!)).toHaveNoViolations();
  });
  describe("localStorage", () => {
    test('sets correct value in localStorage', () => {
      localStorage.clear();
      render(
        <Counter>
          <div>child</div>
        </Counter>
      );
      let lsData = localStorage.getItem(CBS_KEY);
      let jsonData = lsData ? JSON.parse(lsData) : {pageVisits: 1};
      expect(jsonData.pageVisits).toEqual(1);
    });
  });
});
