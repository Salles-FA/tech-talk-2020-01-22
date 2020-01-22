import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Input,
  Button,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  Grid,
  Typography
} from '@material-ui/core';
import { useFormikContext, Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: 200
  }
}));

export default function FormikExample() {
  const classes = useStyles();
  const validationSchema = Yup.object({
    received: Yup.object({
      amount: Yup.number()
        .moreThan(0)
        .required(),
      fee: Yup.number()
        .min(0)
        .max(100)
        .required(),
      value: Yup.number()
        .moreThan(0)
        .required()
    }),
    spent: Yup.object({
      amount: Yup.number()
        .moreThan(0)
        .required(),
      fee: Yup.number()
        .min(0)
        .max(100)
        .required(),
      value: Yup.number()
        .moreThan(0)
        .required()
    }),
    total: Yup.number()
      .moreThan(0)
      .required()
  });
  const initialValues = {
    received: { amount: '', fee: '', value: '' },
    spent: { amount: '', fee: '', value: '' },
    total: ''
  };

  const onSubmit = (values, actions) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      actions.setSubmitting(false);
    }, 1000);
  };

  const myFormikProps = {
    validationSchema,
    initialValues,
    onSubmit
  };

  //#region InputCurrency
  const InputCurrency = ({ label, currency, ...props }) => {
    const [field, meta] = useField(props);
    const formHelperId = `${props.name}-helper-text`;
    return (
      <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
        <InputLabel htmlFor={props.name}>{label}</InputLabel>
        <Input
          {...field}
          {...props}
          error={meta.touched && meta.error}
          startAdornment={<InputAdornment position='start'>{currency}</InputAdornment>}
          aria-describedby={formHelperId}
        />
        <FormHelperText error id={formHelperId}>
          {meta.touched && meta.error}
        </FormHelperText>
      </FormControl>
    );
  };

  InputCurrency.propTypes = {
    label: PropTypes.string.isRequired,
    currency: PropTypes.string,
    name: PropTypes.string.isRequired
  };

  InputCurrency.defaultProps = {
    currency: 'R$'
  };
  //#endregion InputCurrency

  //#region InputPercent
  const InputPercent = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const formHelperId = `${props.name}-helper-text`;
    return (
      <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
        <InputLabel htmlFor={props.name}>{label}</InputLabel>
        <Input
          {...field}
          {...props}
          error={meta.touched && meta.error}
          endAdornment={<InputAdornment position='end'>%</InputAdornment>}
          aria-describedby={formHelperId}
        />
        <FormHelperText error id={formHelperId}>
          {meta.touched && meta.error}
        </FormHelperText>
      </FormControl>
    );
  };

  InputPercent.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };
  //#endregion InputPercent

  //#region AutoCalc
  const AutoCalc = () => {
    const { values, setFieldValue } = useFormikContext();
    React.useEffect(() => {
      setFieldValue('received.value', (values.received.amount * values.received.fee) / 100);
      setFieldValue('spent.value', (values.spent.amount * values.spent.fee) / 100);
      setFieldValue('total', values.received.value - values.spent.value);
    }, [setFieldValue, values]);

    return null;
  };
  //#endregion AutoCalc

  return (
    <div className={classes.root}>
      <Formik {...myFormikProps}>
        <Form>
          <Typography gutterBottom variant='subtitle1'>
            Received
          </Typography>
          <Grid container xs={12}>
            <InputCurrency label='Amount' name='received.amount' placeholder='0.00'></InputCurrency>
            <InputPercent label='Fee' name='received.fee' placeholder='0.00'></InputPercent>
            <InputCurrency disabled label='Value' name='received.value' placeholder='0.00'></InputCurrency>
          </Grid>
          <Typography gutterBottom variant='subtitle1'>
            Spent
          </Typography>
          <Grid container xs={12}>
            <InputCurrency label='Amount' name='spent.amount' placeholder='0.00'></InputCurrency>
            <InputPercent label='Fee' name='spent.fee' placeholder='0.00'></InputPercent>
            <InputCurrency disabled label='Value' name='spent.value' placeholder='0.00'></InputCurrency>
          </Grid>
          <Typography gutterBottom variant='subtitle1'>
            Total
          </Typography>
          <Grid container xs={12}>
            <Grid item>
              <InputCurrency disabled label='Total' name='total' placeholder='0.00'></InputCurrency>
            </Grid>
          </Grid>
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>
          <AutoCalc />
        </Form>
      </Formik>
    </div>
  );
}
