import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Button, InputLabel, InputAdornment, FormHelperText, FormControl, Grid } from '@material-ui/core';
import { Formik, Form, useField } from 'formik';
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

  //#region InputPercent
  const InputPercent = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const componentId = props.id || props.name;
    const formHelperId = `${componentId}-helper-text`;
    return (
      <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
        <InputLabel htmlFor={componentId}>{label}</InputLabel>
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
  //#endregion InputPercent

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{ fee: '' }}
        validationSchema={Yup.object({
          fee: Yup.number()
            .min(0)
            .max(100)
            .required()
        })}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        <Form>
          <Grid container xs={12}>
            <InputPercent label='Fee' name='fee'></InputPercent>
          </Grid>
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
