/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import Backdrop from './Backdrop';
import Modal from './Modal';

const ErrorHandler = (props) => (
  <Fragment>
    {props.error && <Backdrop onClick={props.onHandle} />}
    {props.error && (
      <Modal
        title="An Error Occurred"
        onCancelModal={props.onHandle}
        onAcceptModal={props.onHandle}
        acceptEnabled
      >
        <p>{props.error.message}</p>
      </Modal>
    )}
  </Fragment>
);

export default ErrorHandler;
