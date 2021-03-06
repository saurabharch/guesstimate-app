import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {GuesstimateTypeIcon} from './GuesstimateTypeIcon'
import {TextInput} from './TextInput'
import {DistributionSelector} from './DistributionSelector'

import {Guesstimator} from 'lib/guesstimator/index'

export class TextForm extends Component{
  displayName: 'GuesstimateInputForm'

  state = { showDistributionSelector: false }

  static propTypes = {
    onChangeInput: PropTypes.func.isRequired,
    onAddData: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onChangeGuesstimateType: PropTypes.func.isRequired,
    onAddDefaultData: PropTypes.func,
    onChangeClickMode: PropTypes.func,
    onFocus: PropTypes.func,
    guesstimate: PropTypes.object,
    size: PropTypes.string
  }

  focus() { this.refs.TextInput.getWrappedInstance().focus() }

  onChangeInput(input) {
    this.props.onChangeInput(input)
    this.setState({showDistributionSelector: false})
  }

  _flagMetricAsClicked() {
    if (this.props.guesstimate.guesstimateType === 'FUNCTION') {
      this.props.onChangeClickMode('FUNCTION_INPUT_SELECT')
    }
  }

  _handleBlur() {
    this.props.onChangeClickMode()
    this.props.onSave()
  }

  _textInput() {
    const {
      props: {
        guesstimate: {input, guesstimateType},
        inputMetrics,
        size,
        organizationId,
        canUseOrganizationFacts,
        onChangeInput,
        onAddData,
        onChangeGuesstimateType,
        onReturn,
        onTab,
      }, state: {
        showDistributionSelector,
      }
    } = this

    const shouldDisplayType = !(guesstimateType === 'POINT' || guesstimateType === 'FUNCTION')
    const shouldBeWide = !(guesstimateType === 'FUNCTION')
    const validInputReadableIds = inputMetrics.filter(
      m => !_.get(m, 'simulation.sample.errors.length') && !!_.get(m, 'simulation.sample.values.length')
    ).map(m => m.readableId)
    const errorInputReadableIds = inputMetrics.filter(
      m => !!_.get(m, 'simulation.sample.errors.length') || !_.get(m, 'simulation.sample.values.length')
    ).map(m => m.readableId)

    // To see if this guesstimate is a valid choice for a lognormal distribution, we'll try to parse it with
    // guesstimateType manually set to 'LOGNORMAL', and see if the parser corrects that type to something else. This
    // approach is a bit hacky, but it gets the job done.
    const [_1, parsed] = Guesstimator.parse({input, guesstimateType: 'LOGNORMAL'})
    const parsedType = _.get(parsed, 'parsedInput.guesstimateType')
    const isLognormalValid = parsedType === 'LOGNORMAL'

    return(
      <div className='GuesstimateInputForm'>
        <div className='GuesstimateInputForm--row'>
          <TextInput
            value={input}
            validInputs={validInputReadableIds}
            errorInputs={errorInputReadableIds}
            onReturn={onReturn}
            onTab={onTab}
            onChange={this.onChangeInput.bind(this)}
            onFocus={this._flagMetricAsClicked.bind(this)}
            onBlur={this._handleBlur.bind(this)}
            onChangeData={onAddData}
            ref='TextInput'
            width={shouldBeWide ? 'NARROW' : "WIDE"}
            organizationId={organizationId}
            canUseOrganizationFacts={canUseOrganizationFacts}
          />

          { shouldDisplayType &&
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType}
              toggleDistributionSelector={() => this.setState({showDistributionSelector: !showDistributionSelector})}
            />
          }
        </div>

        {showDistributionSelector &&
          <div className='GuesstimateInputForm--row'>
            <DistributionSelector
              disabledTypes={isLognormalValid ? [] : ['LOGNORMAL']}
              onSubmit={onChangeGuesstimateType}
              selected={guesstimateType}
            />
          </div>
        }
      </div>
    )
  }

  render() {
    const {size, guesstimate: {input}} = this.props
    if (size !== 'large') {
      return( this._textInput() )
    }

    return(
      <div className='row'>
        <div className='col-sm-8'>
          {this._textInput()}
        </div>
        <div className='col-sm-4'>
          {_.isEmpty(input) &&
            <a className='custom-data' onClick={this.props.onAddDefaultData}>
              Add Custom Data
            </a>
          }
        </div>
      </div>
    )
  }
}
