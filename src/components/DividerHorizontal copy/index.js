import React from 'react';
import {View} from 'react-native';

const DividerVertical = ({height}) => {
  return (
    <View
      style={{
        height: height,
        width: 2,
        backgroundColor: 'black',
        opacity: 0.5,
        borderRadius: 20,
      }}
    />
  );
};

export default DividerVertical;
