import React from 'react';
import {View} from 'react-native';

const DividerHorizontal = ({width}) => {
  return (
    <View
      style={{
        height: 2,
        width: width,
        backgroundColor: 'black',
        opacity: 0.5,
        borderRadius: 20,
      }}
    />
  );
};

export default DividerHorizontal;
