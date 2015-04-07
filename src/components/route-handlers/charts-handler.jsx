/*
Open Chord Charts -- Database of free chord charts
By: Christophe Benz <contact@openchordcharts.org>

Copyright (C) 2012, 2013, 2014, 2015 Christophe Benz
https://github.com/openchordcharts/

This file is part of Open Chord Charts.

Open Chord Charts is free software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

Open Chord Charts is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

@flow weak
*/


'use strict';


var React = require('react');

var ChartsPage = require('../pages/charts-page');
var PageContainer = require('../page-container');
var propTypes = require('../../prop-types');
var webservices = require('../../webservices');


var ChartsHandler = React.createClass({
  propTypes: {
    appState: propTypes.appState.isRequired,
    charts: React.PropTypes.arrayOf(propTypes.chart),
    errors: React.PropTypes.object,
  },
  statics: {
    fetchData(params, query) {
      // query is used when user clicks on chart owner, to open a list of charts belonging to this owner.
      return webservices.fetchCharts(query);
    },
  },
  render() {
    var content;
    if (this.props.appState.loading) {
      content = this.props.appState.loading === 'slow' ? (
        <PageContainer>
          <p>Loading…</p>
        </PageContainer>
      ) : null;
    } else if (this.props.errors && this.props.errors.charts) {
      content = (
        <PageContainer>
          <p>Unable to fetch data from API.</p>
        </PageContainer>
      );
    } else {
      content = (
        <ChartsPage charts={this.props.charts} loggedInUsername={this.props.appState.loggedInUsername} />
      );
    }
    return content;
  },
});


module.exports = ChartsHandler;
