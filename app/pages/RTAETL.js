import React from 'react';
import { Image, Accordion, Icon, Table } from 'semantic-ui-react';

class RTA_ETL extends React.Component {
  constructor() {
    super();
    this.state = { activeIndex: 0 };
  }

  handleAccordionClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = this.state.activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }
  render() {
    const { activeIndex } = this.state;

    return (
      <div>
       <h1>RTA ETL</h1>
      </div>
    );
  }
}

module.exports = RTA_ETL;
