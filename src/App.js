
import React from 'react';
import { Card, CardBody, Button, Form, FormGroup, Input, Container, CardHeader } from 'reactstrap';
import { ProgressBar } from 'react-bootstrap'
import './App.css';
import './container.css'
import ListEntry from './ListEntry';
import Header from './Header'
import axios from 'axios'

import { BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Label, ResponsiveContainer, Cell } from 'recharts';
import TypeTooltip from './TypeTooltip';
import ColorTooltip from './ColorTooltip';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state =
    {
      loaded: false,
      deckURL: null,
      loadError: false,
      loadingDeck: false,
      cmcIncludeLands: false,
      colorIncludeColorless: false,
      pipsIncludeColorless: false,
      sortStatus: "not sorted",
      loadProgressNumber: 0,
      loadProgressStatus: "Reading Provided URL",
      typeShowCardLists: false,
      colorShowCardLists: false,
    };

    this.loadDeck = this.loadDeck.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)

    this.cmcIncludeLandsCheck = this.cmcIncludeLandsCheck.bind(this)
    this.colorIncludeColorlessCheck = this.colorIncludeColorlessCheck.bind(this)
    this.pipsIncludeColorlessCheck = this.pipsIncludeColorlessCheck.bind(this)

    this.sortByName = this.sortByName.bind(this)
    this.sortBySet = this.sortBySet.bind(this)
    this.sortByTCGPrice = this.sortByTCGPrice.bind(this)
    this.sortByCKPrice = this.sortByCKPrice.bind(this)

    this.barClick = this.typeBarClick.bind(this)

    this.colorMap = { Colorless: "#8e8e93", White: "#ffcc00", Blue: "#5ac8fa", Black: "#242526", Red: "#ff3b30", Green: "#4cd964", }

    this.minGraphWidth = '200px'
    this.minGraphHeight = '325px'
  }

  render() {
    return (
      // style={{ height: '100vh', width: "100vw" }}
      <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0, pointerEvents: 'none' }}>
        {/* The header for the website when nothing is loaded
        {!this.state.loaded && <Header mode="Welcome" style={{ pointerEvents: 'auto' }} />}

        {/* The welcome page of the analyzer. */}
        {/* {!this.state.loaded &&
          <Container style={{ pointerEvents: 'auto', height: '66%', width: '90%' }} fluid>
            <Card>
              <CardBody>
                <p style={{ fontSize: '1.35em' }}>
                  Welcome to the Deck Analyzer!
                </p>
                <hr></hr>
                <div>
                  To start, put the URL to your deck below, and the Analyzer will display information about it.
                </div>
                <p>
                  You can use this link as an example, if you want: <a href="https://archidekt.com/decks/468872">https://archidekt.com/decks/468872</a>
                </p>

                <p style={{ color: 'grey' }}>
                  (Currently, the Analyzer has only been tested with Commander decks. If your deck is not a Commander deck, the Analyzer may not work as intended!)
                </p>

                <Form onSubmit={this.handleKeyPress}>
                  <FormGroup>
                    <Label for="deckURL">Deck URL</Label>
                    <Input

                      type="url"
                      name="url" id="inputURL"
                      placeholder="Archidekt URL goes here"
                      onChange={e => this.setState({ deckURL: e.target.value })}>
                    </Input>
                  </FormGroup>
                </Form>

                {!this.state.loadingDeck && <Button style={{ width: "100%" }} onClick={this.loadDeck}>Load</Button>}

                {this.state.loadError &&
                  <Card>
                    <CardHeader color="text-warning">Error loading decklist!</CardHeader>
                  </Card>}

                {this.state.loadingDeck &&
                  <div>
                    <ProgressBar animated now={100} label={this.state.loadProgressStatus}>
                    </ProgressBar>
                  </div>}
              </CardBody>
            </Card>
          </Container>} */}

        {!this.state.loaded &&
          <div className='welcomeContainer' style={{ fontSize: '1.1rem'}}>
            <div className='welcomeHeader'>
              <Header mode="Welcome" style={{ pointerEvents: 'auto' }} />
            </div>

            <div className='welcome' >
              <p style={{ fontSize: '2rem' }}>
                Welcome to the Deck Analyzer!
              <hr></hr>
              </p>
              <p >The Deck Analyzer is a tool that helps you when you're deckbuilding Magic: The Gathering decks.</p>
              <p>To assist you, it can do things like:</p>

            </div>

            <div className='paddingLeft'/>

            <div className='paddingRight'/>

            <div className='example1'>
              {/* <img src='https://cdn.pixabay.com/photo/2017/05/14/03/45/gui-2311261_960_720.png' alt='' style={{ height: '200px', width: '200px'}}></img> */}
              <p>Show you charts about the cards in your deck, based on things like type and mana cost.</p>
            </div>

            <div className='example2'>
              <p>Display stats about your deck, like mana cost median and mode.</p>
            </div>

            <div className='example3'>
              <p>Show you your deck with prices from popular outlets, and let you sort through it by name or set or price.</p>
            </div>

            <div className='launch'>

              <div>
                To start, put the URL to your deck below, and the Analyzer will display information about it.
                </div>
              <p>
                You can use this link as an example, if you want: <a href="https://archidekt.com/decks/468872">https://archidekt.com/decks/468872</a>
              </p>

              <p style={{ color: 'grey' }}>
                (Currently, the Analyzer has only been tested with Commander decks. If your deck is not a Commander deck, the Analyzer may not work as intended!)
                </p>

              <Form onSubmit={this.handleKeyPress}>
                <FormGroup>
                  <Label for="deckURL">Deck URL</Label>
                  <Input

                    type="url"
                    name="url" id="inputURL"
                    placeholder="Archidekt URL goes here"
                    onChange={e => this.setState({ deckURL: e.target.value })}>
                  </Input>
                </FormGroup>
              </Form>

              {!this.state.loadingDeck && <Button style={{ width: "100%" }} onClick={this.loadDeck}>Load</Button>}

              {this.state.loadError &&
                <Card>
                  <CardHeader color="text-warning">Error loading decklist!</CardHeader>
                </Card>}

              {this.state.loadingDeck &&
                <div>
                  <ProgressBar animated now={100} label={this.state.loadProgressStatus}>
                  </ProgressBar>
                </div>}
            </div>
          </div>
        }

        {/* The information display for after the deck has been loaded / analyzed */}
        {this.state.loaded &&
          <div className="customContainer" style={{ pointerEvents: 'none' }}>
            <div className="header">
              <Header mode="Loaded" deckName={this.state.deckName} deckURL={this.state.deckURL} />
            </div>
            <div className="sidebar" style={{ minWidth: "440px" }}>
              <Card style={{ height: '70%' }}>
                <CardHeader style={{ paddingLeft: "11px" }}><b>Deck List</b> <i style={{ color: 'grey', fontSize: '14px' }}> (Click headers to sort by category, hover to see card) </i></CardHeader>
                <div style={{ display: 'block', height: '100%', width: "100%", overflow: 'auto', border: "1px solid LightGray", }}>
                  <table style={{ height: "100%", width: "100%" }}>
                    <thead style={{ position: 'sticky', top: '0' }}>
                      <tr style={{ position: 'sticky', top: '0' }}>
                        <th scope="col" onClick={this.sortByName}>Card Name</th>
                        <th scope="col" onClick={this.sortBySet}>Set</th>
                        <th scope="col" onClick={this.sortByTCGPrice}>TCG Price</th>
                        <th scope="col" onClick={this.sortByCKPrice}>CK Price</th>
                      </tr>
                    </thead>
                    <tbody style={{ height: '100%', width: "100%" }}>
                      {this.state.listOfCards}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card style={{ height: "30%" }}>
                <CardHeader style={{ paddingLeft: "11px" }}><b>Stats</b></CardHeader>
                <CardBody style={{ paddingLeft: "11px", display: "block", overflow: "auto" }}>

                  <table>
                    <tr>
                      <td style={{ textAlign: "right" }}>
                        Total cost from TCGPlayer:
                      </td>
                      <td style={{ textAlign: "left", color: "#5856d6" }}>
                        &nbsp;{"$" + this.state.TCGCost.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right" }}>
                        Most expensive from TCGPlayer:
                      </td>
                      <td style={{ textAlign: "left", color: "#5856d6" }}>
                        &nbsp;{this.state.TCGMax.name + " ($" + this.state.TCGMax.cost.toFixed(2) + ")"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right" }}>
                        Total cost from Card Kingdom:
                      </td>
                      <td style={{ textAlign: "left", color: "#5856d6" }}>
                        &nbsp;{"$" + this.state.CKCost.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right" }}>
                        Most expensive from CK:
                      </td>
                      <td style={{ textAlign: "left", color: "#5856d6" }}>
                        &nbsp;{this.state.CKMax.name + " ($" + this.state.CKMax.cost.toFixed(2) + ")"}
                      </td>
                    </tr>
                  </table>
                </CardBody>
              </Card>
            </div>
            <div className="boxone">
              <Card style={{ height: "100%", width: "100%", minWidth: this.minGraphWidth, minHeight: this.minGraphHeight }}>
                <CardHeader >
                  <b>CMC Breakdown</b>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer height="90%" width="100%">
                    <BarChart data={(this.state.cmcIncludeLands) ? this.state.cmcData : this.state.cmcDataNoLands}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cmc">
                        <Label value="CMC" position="insideBottom" offset={-5}></Label>
                      </XAxis>
                      <YAxis>
                        <Label value='Number of Cards' angle={-90} position='insideLeft' style={{ textAnchor: 'middle' }} />
                      </YAxis>
                      <Tooltip />
                      <Bar dataKey="Land" stackId="a" fill="#8e8e93" />
                      <Bar dataKey="Instant" stackId="a" fill="#ffcc00" />
                      <Bar dataKey="Sorcery" stackId="a" fill="#ff9500" />
                      <Bar dataKey="Creature" stackId="a" fill="#ff3b30" />
                      <Bar dataKey="Artifact" stackId="a" fill="#4cd964" />
                      <Bar dataKey="Enchantment" stackId="a" fill="#34aadc" />
                      <Bar dataKey="Planeswalker" stackId="a" fill="#5856d6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <table style={{ height: "10%", width: "100%" }}>
                    <tr style={{ paddingTop: "8px" }}>
                      <td style={{ textAlign: 'left' }}>

                        <div>
                          <input type="checkbox" onChange={this.cmcIncludeLandsCheck} ></input>
                          {' '}Include Lands
                          </div>

                      </td>

                      <td style={{ textAlign: 'right' }}>
                        Mean: {(this.state.cmcIncludeLands) ? this.state.cmcMean.toFixed(2) : this.state.cmcMeanNoLands.toFixed(2)}
                        &nbsp;&nbsp; Median: {(this.state.cmcIncludeLands) ? this.state.cmcMedian.toFixed(2) : this.state.cmcMedianNoLands.toFixed(2)}
                        &nbsp;&nbsp; Mode: {(this.state.cmcIncludeLands) ? this.state.cmcMode.toFixed(2) : this.state.cmcModeNoLands.toFixed(2)}
                      </td>

                    </tr>
                  </table>

                </CardBody>
              </Card>
            </div>
            <div className="boxtwo">
              <Card style={{ height: "100%", width: "100%", minWidth: this.minGraphWidth, minHeight: this.minGraphHeight }}>
                <CardHeader>
                  <b>Type Distribution</b>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer height="90%" width="100%">
                    <BarChart data={this.state.typeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type">
                        <Label value="Card Type" position="insideBottom" offset={-5}></Label>
                      </XAxis>
                      <YAxis>
                        <Label value='Number of Cards' angle={-90} position='insideLeft' style={{ textAnchor: 'middle' }} />
                      </YAxis>
                      <Tooltip content={<TypeTooltip showCardLists={this.state.typeShowCardLists} cardLists={this.state.typeCardLists}></TypeTooltip>} />
                      <Bar dataKey="number" >
                        {this.state.typeData.map((entry, index) => (<Cell onClick={() => this.typeBarClick(entry.type)} key={`cell-${index}`} fill={this.state.typeColorMap[entry.type]} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
            <div className="boxthree">
              <Card style={{ height: "100%", width: "100%", minWidth: this.minGraphWidth, minHeight: this.minGraphHeight }}>
                <CardHeader>
                  <b>Color Breakdown</b>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer height="90%" width="100%">
                    <BarChart data={(this.state.colorIncludeColorless) ? this.state.colorDataWithColorless : this.state.colorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="color"></XAxis>
                      <YAxis>
                        <Label value='Number of Cards by Color' angle={-90} position='insideLeft' style={{ textAnchor: 'middle' }} />
                      </YAxis>
                      <Tooltip content={<ColorTooltip showCardLists={this.state.colorShowCardLists} cardLists={this.state.colorCardLists}></ColorTooltip>} />
                      <Bar dataKey="number">
                        {
                          (this.state.colorIncludeColorless) ?
                            this.state.colorDataWithColorless.map((entry, index) => (
                              <Cell key={`cell-${index}`} onClick={() => this.colorBarClick(entry.type)} fill={this.state.colors[entry.color]} />))
                            :
                            this.state.colorData.map((entry, index) => (
                              <Cell key={`cell-${index}`} onClick={() => this.colorBarClick(entry.type)} fill={this.state.colors[entry.color]} />))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <form style={{ height: "10%" }}>
                    <label>
                      <input type="checkbox" onChange={this.colorIncludeColorlessCheck} ></input>
                      {' '}Include Colorless Nonland Cards
                  </label>
                  </form>
                </CardBody>
              </Card>

            </div>
            <div className="boxfour" style={{ pointerEvents: 'none' }}>
              <Card style={{ height: "100%", width: "100%", position: 'relative', zIndex: -1, pointerEvents: 'auto', minWidth: this.minGraphWidth, minHeight: this.minGraphHeight }}>
                <CardHeader>
                  <b>Number of Colored Pips</b>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer height="90%" width="100%" >
                    <BarChart data={(this.state.pipsIncludeColorless) ? this.state.pipsDataWithColorless : this.state.pipsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="color"></XAxis>
                      <YAxis>
                        <Label value='Number of Each Colored Pip' angle={-90} position='insideLeft' style={{ textAnchor: 'middle' }} />
                      </YAxis>
                      <Tooltip />
                      <Bar dataKey="number">
                        {
                          (this.state.pipsIncludeColorless) ?
                            this.state.pipsDataWithColorless.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                            :
                            this.state.pipsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={this.state.colors[entry.color]} />))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <form style={{ height: "10%" }}>
                    <label>
                      <input type="checkbox" style={{ position: 'relative', zIndex: '1000' }} onChange={this.pipsIncludeColorlessCheck} ></input>
                      {' '}Include {String.fromCharCode(9830)} Pips
                  </label>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        }
      </div>
    );
  }

  /**
   * Toggles the card lists on the type bargraph tooltip
   */
  typeBarClick() {
    this.setState({ typeShowCardLists: !this.state.typeShowCardLists })
  }

  colorBarClick() {
    this.setState({ colorShowCardLists: !this.state.colorShowCardLists })
  }

  sortByName() {
    if (this.state.sortStatus === "by name alphabetical") {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by name inverse alphabetical", listOfCards: tmpDeck })
    } else {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by name alphabetical", listOfCards: tmpDeck })
    }
  }

  sortBySet() {
    if (this.state.sortStatus === "by set alphabetical") {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => b.setCode.localeCompare(a.setCode))
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by set inverse alphabetical", listOfCards: tmpDeck })
    } else {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => a.setCode.localeCompare(b.setCode))
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by set alphabetical", listOfCards: tmpDeck })
    }
  }

  sortByTCGPrice() {
    if (this.state.sortStatus === "by TCG price") {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => a.tcgprice - b.tcgprice)
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by inverse TCG price", listOfCards: tmpDeck })
    } else {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => b.tcgprice - a.tcgprice)
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by TCG price", listOfCards: tmpDeck })
    }
  }

  sortByCKPrice() {
    if (this.state.sortStatus === "by CK price") {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => a.ckprice - b.ckprice)
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by CK inverse price", listOfCards: tmpDeck })
    } else {
      let sorted = [...this.state.deck]
      sorted.sort((a, b) => b.ckprice - a.ckprice)
      let tmpDeck = sorted.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      this.setState({ sortStatus: "by CK price", listOfCards: tmpDeck })
    }
  }

  cmcIncludeLandsCheck() {
    this.setState({ cmcIncludeLands: !this.state.cmcIncludeLands })
  }

  colorIncludeColorlessCheck() {
    this.setState({ colorIncludeColorless: !this.state.colorIncludeColorless })
  }

  pipsIncludeColorlessCheck() {
    this.setState({ pipsIncludeColorless: !this.state.pipsIncludeColorless })
  }

  /**
   * A small helper method that stops the form from reloading the page and submitting in
   * the normal way, and instead calls the native deck loading function
   * @param {The action the user is triggering} event 
   */
  handleKeyPress(event) {
    event.preventDefault()
    this.loadDeck()
  }

  /**
   * Loads the decklist from the URL the user provides, and does analysis of
   * the deck for the other components to display.
   */
  loadDeck() {
    let jsonDeck = null

    this.setState({ loadProgressNumber: 20, loadProgressStatus: "Reading URL" })

    // If no valid url is found, don't try loading!
    if (this.state.deckURL == null || "") {
      console.log("Null/empty URL on call")
      return
    }

    // Split out the parts of the URL that are separated by slashes
    let urlParts = this.state.deckURL.split("/")
    if (urlParts.length < 5) {
      console.log("Error parsing URL")
      return;
    }

    let nameAndNumber = urlParts[4]
    let nameAndNumberParts = nameAndNumber.split("#")

    // The unique ID for an archidekt deck. Needed for lookup
    let number = parseInt(nameAndNumberParts[0])

    // Update state so we can start loading the deck
    this.setState({ loadingDeck: true })

    // Create an axios instance to send our get request to Archidekt.
    let axiosInstance = axios.create({
      baseURL: 'https://cors-anywhere.herokuapp.com/https://archidekt.com/api/'
    });

    // Other proxies that can be used:
    //'https://thingproxy.freeboard.io/fetch/https://archidekt.com/api/'
    //'https://cors-anywhere.herokuapp.com/https://archidekt.com/api/'

    this.setState({ loadProgressNumber: 40, loadProgressStatus: "Downloading Deck" })

    // Send the get request, and do the result on response (when the promise is fullfilled)
    axiosInstance.get('decks/' + number + "/").then((response) => {
      jsonDeck = response
      console.log(response)

      let deckName = response.data.name

      // If there is some error fetching the deck, set the state and exit
      if (jsonDeck == null) {
        this.setState({ loadError: true, loadDeck: false, loadingDeck: false })
        this.console.log("Error loading deck!")
        return
      }

      // Extract the actual json object that holds all the cards
      let jsonCards = jsonDeck.data.cards

      // Set up variables to be used to track information about the cards that were loaded
      let jsCards = []

      let cmcRawData = {}
      let cmcRawDataNoLands = {}
      let typeRawData = {}
      let typeCardLists = {}
      let colorRawData = {}
      let numColorless = 0
      let pipsRawData = {}
      let numColorlessPips = 0

      let tcgTotalCost = 0
      let ckTotalCost = 0
      let maxTCG = null
      let maxCK = null

      let colorCardLists = {}

      this.setState({ loadProgressNumber: 60, loadProgressStatus: "Reading Cards" })

      // For each card, parse all the information we need from it
      for (let i = 0; i < jsonCards.length; i++) {
        // Skip all cards in the MAYBEBOARD Category by default
        if (jsonCards[i].category === "Maybeboard") {
          continue
        }

        // Get the price for TCGPlayer and CK, depending on wether the card is foil or not 
        let tmpTCGPrice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.tcgfoil : jsonCards[i].card.prices.tcg;
        let tmpCKPRice = (jsonCards[i].modifier === "Foil") ? jsonCards[i].card.prices.ckfoil : jsonCards[i].card.prices.ck;

        // Increase the cost by the quantity
        tcgTotalCost += tmpTCGPrice * jsonCards[i].quantity
        ckTotalCost += tmpCKPRice * jsonCards[i].quantity

        // Compare this card's price to the max we have seen so far, updating if needed
        // These could be merged, but I think it is more readable with seperate cases
        if (maxTCG == null) {
          maxTCG = { name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice }
        } else if (maxTCG.cost < tmpTCGPrice) {
          maxTCG = { name: jsonCards[i].card.oracleCard.name, cost: tmpTCGPrice }
        }
        // Same with CK
        if (maxCK == null) {
          maxCK = { name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice }
        } else if (maxCK.cost < tmpCKPRice) {
          maxCK = { name: jsonCards[i].card.oracleCard.name, cost: tmpCKPRice }
        }

        // Create the custom JavaScript object to hold all of this card's data
        let tmp = new MTGCard(jsonCards[i].card.oracleCard.name,
          jsonCards[i].card.oracleCard.colors,
          jsonCards[i].card.oracleCard.manaCost,
          jsonCards[i].card.oracleCard.cmc,
          jsonCards[i].card.oracleCard.types,
          jsonCards[i].modifier,
          tmpTCGPrice,
          tmpCKPRice,
          jsonCards[i].card.edition.editioncode,
          jsonCards[i].card.edition.editionname,
          jsonCards[i].card.multiverseid
        );

        // Add the cmc of this card to the raw CMC list
        let cmcKey = "" + tmp.cmc
        if (cmcKey in cmcRawData) {
          if (tmp.types[0] in cmcRawData[cmcKey]) {
            cmcRawData[cmcKey][tmp.types[0]] = cmcRawData[cmcKey][tmp.types[0]] + (1 * jsonCards[i].quantity)
          } else {
            cmcRawData[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
          }
        } else {
          cmcRawData[cmcKey] = {}
          cmcRawData[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
        }

        // Add this card to the raw types for NONLANDS if this card is not a land
        if (!tmp.types.includes("Land")) {
          if (cmcKey in cmcRawDataNoLands) {
            if (tmp.types[0] in cmcRawDataNoLands[cmcKey]) {
              cmcRawDataNoLands[cmcKey][tmp.types[0]] = cmcRawDataNoLands[cmcKey][tmp.types[0]] + (1 * jsonCards[i].quantity)
            } else {
              cmcRawDataNoLands[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
            }
          } else {
            cmcRawDataNoLands[cmcKey] = {}
            cmcRawDataNoLands[cmcKey][tmp.types[0]] = (1 * jsonCards[i].quantity)
          }
        }

        // Add the types of this card to the raw values of the deck
        for (let j = 0; j < tmp.types.length; j++) {
          let type = tmp.types[j]
          if (type in typeRawData) {
            typeRawData[type] = typeRawData[type] + (1 * jsonCards[i].quantity)
            typeCardLists[type].push(tmp.name)
          } else {
            typeRawData[type] = (1 * jsonCards[i].quantity)
            typeCardLists[type] = []
            typeCardLists[type].push(tmp.name)
          }
        }

        // TODO: Needs support for colorless cards
        // Add the colors of this card to the tracker for those in the deck
        for (let j = 0; j < tmp.colors.length; j++) {
          let color = tmp.colors[j]
          if (color in colorRawData) {
            colorRawData[color] = colorRawData[color] + 1
            colorCardLists[color].push(tmp.name)
          } else {
            colorRawData[color] = 1
            colorCardLists[color] = []
            colorCardLists[color].push(tmp.name)
          }
        }
        // Make sure to count this card as colorless if it is! (lands don't count :) )
        if (tmp.colors.length === 0 && !tmp.types.includes("Land")) {
          numColorless++
          if ("Colorless" in colorCardLists) {
            colorCardLists["Colorless"].push(tmp.name)
          } else {
            colorCardLists["Colorless"] = []
            colorCardLists["Colorless"].push(tmp.name)
          }
        }


        // TODO: Needs support for colorless mana symbols
        // Parse the pip color symbols for this card and add them to the trackers
        for (let j = 0; j < tmp.manaCost.length; j++) {
          let ch = tmp.manaCost.charAt(j)
          console.log(colorCardLists)

          // Match the manacost character to the name of the color it belongs to
          // and increment the count in the corresponding data entry
          // eslint-disable-next-line default-case
          switch (ch) {
            case "W":
              if ("White" in pipsRawData) {
                pipsRawData["White"]++

              } else {
                pipsRawData["White"] = 1

              }
              break;
            case "U":
              if ("Blue" in pipsRawData) {
                pipsRawData["Blue"]++

              } else {
                pipsRawData["Blue"] = 1

              }
              break;
            case "B":
              if ("Black" in pipsRawData) {
                pipsRawData["Black"]++

              } else {
                pipsRawData["Black"] = 1

              }
              break;
            case "R":
              if ("Red" in pipsRawData) {
                pipsRawData["Red"]++

              } else {
                pipsRawData["Red"] = 1

              }
              break;
            case "G":
              if ("Green" in pipsRawData) {
                pipsRawData["Green"]++

              } else {
                pipsRawData["Green"] = 1

              }
              break;
            case "C":
              if (!tmp.types.includes("Land")) {
                numColorlessPips++
              }
              break
            default:
              break;
          }
        }

        jsCards.push(tmp)
      }

      // Put the CMC data in the form the charts need (objects)

      console.log(cmcRawData)

      this.setState({ loadProgressNumber: 80, loadProgressStatus: "Analyzing Cards" })

      // Calculate the mean

      let numbersByCmc = Object.values(cmcRawData)

      let cmcSum = 0;
      let cmcTotalEntries = 0;

      let cmcModeValue = 0
      let cmcModeOccurences = 0
      let cmcMedianArray = []
      for (let i = 0; i < numbersByCmc.length; i++) {
        // Work on finding the mean
        console.log(numbersByCmc[i])
        let subtypesValues = Object.values(numbersByCmc[i])
        console.log("cmc " + i + " values array: " + subtypesValues)
        let totalNumberOfEntries = subtypesValues.reduce((acc, curr) => acc + curr, 0)
        console.log("total cards at cmc " + i + ": " + totalNumberOfEntries)
        cmcSum += (i * totalNumberOfEntries);
        cmcTotalEntries += totalNumberOfEntries

        // Work on finding the mode
        if (totalNumberOfEntries > cmcModeOccurences) {
          cmcModeOccurences = totalNumberOfEntries;
          cmcModeValue = i;
        }

        // Work on finding the median
        for (let j = 0; j < totalNumberOfEntries; j++) {
          cmcMedianArray.push(i)
        }
      }

      let cmcMean = cmcSum / cmcTotalEntries;
      console.log(cmcMean)

      let cmcMedianValue = cmcMedianArray[Math.round(cmcMedianArray.length / 2)]

      this.setState({ cmcMean: cmcMean, cmcMode: cmcModeValue, cmcMedian: cmcMedianValue })

      let cmcData = []
      for (var key in cmcRawData) {
        let pushMe = cmcRawData[key]
        pushMe["cmc"] = key
        cmcData.push(pushMe)
      }

      // Put the CMC data in the form the charts need (objects)

      let cmcMedianNoLands = 0;
      let cmcModeNoLands = 0;

      let cmcSumNoLands = 0;
      let cmcTotalEntriesNoLands = 0;

      let cmcModeValueNoLands = 0
      let cmcModeOccurencesNoLands = 0

      let cmcMedianArrayNoLands = []

      // Calculate the mean without lands
      let numbersByCmc2 = Object.values(cmcRawDataNoLands)
      for (let i = 0; i < numbersByCmc2.length; i++) {
        console.log(numbersByCmc2[i])
        let subtypesValues = Object.values(numbersByCmc2[i])
        console.log("NO LANDS cmc " + i + " values array: " + subtypesValues)

        let totalNumberOfEntries = 0;
        for (let j = 0; j < subtypesValues.length; j++) {
          totalNumberOfEntries += subtypesValues[j]
        }

        console.log("NO LANDS total cards at cmc " + i + ": " + totalNumberOfEntries)

        cmcSumNoLands += (i * totalNumberOfEntries);
        cmcTotalEntriesNoLands += totalNumberOfEntries

        if (totalNumberOfEntries > cmcModeOccurencesNoLands) {
          cmcModeOccurencesNoLands = totalNumberOfEntries;
          cmcModeValueNoLands = i;
        }

        for (let j = 0; j < totalNumberOfEntries; j++) {
          cmcMedianArrayNoLands.push(i)
        }

      }

      cmcModeNoLands = cmcModeValueNoLands
      let cmcMeanNoLands = cmcSumNoLands / cmcTotalEntriesNoLands;
      cmcMedianNoLands = cmcMedianArrayNoLands[Math.round(cmcMedianArrayNoLands.length / 2)]
      console.log(cmcMeanNoLands)
      this.setState({ cmcMeanNoLands: cmcMeanNoLands, cmcModeNoLands: cmcModeNoLands, cmcMedianNoLands: cmcMedianNoLands })

      // Prepare the no lands cmc data for the barchart
      let cmcDataNoLands = []
      for (var keyNoLands in cmcRawDataNoLands) {
        let pushMe = cmcRawDataNoLands[keyNoLands]
        pushMe["cmc"] = keyNoLands
        cmcDataNoLands.push(pushMe)
      }

      // Put the type data in the form that the charts need
      let typeData = []
      let typeColorMap = { Land: "#8e8e93", Instant: "#ffcc00", Creature: "#ff3b30", Artifact: "#4cd964", Enchantment: "#34aadc", Planeswalker: "#5856d6", Sorcery: "#ff9500" }
      // Creature, Instant, Sorcery, Artifact, Enchantment, Planeswalker, Land

      // Put each of the types in IN THIS ORDER.
      // This is the best way to do it, since otherwise I would have to write
      // a custom comparator that enforced this exact order, which isn't very clean.
      if ("Creature" in typeRawData) {
        typeData.push({ type: "Creature", number: typeRawData["Creature"] })
      }
      if ("Instant" in typeRawData) {
        typeData.push({ type: "Instant", number: typeRawData["Instant"] })
      }
      if ("Sorcery" in typeRawData) {
        typeData.push({ type: "Sorcery", number: typeRawData["Sorcery"] })
      }
      if ("Artifact" in typeRawData) {
        typeData.push({ type: "Artifact", number: typeRawData["Artifact"] })
      }
      if ("Enchantment" in typeRawData) {
        typeData.push({ type: "Enchantment", number: typeRawData["Enchantment"] })
      }
      if ("Land" in typeRawData) {
        typeData.push({ type: "Land", number: typeRawData["Land"] })
      }
      if ("Planeswalker" in typeRawData) {
        typeData.push({ type: "Planeswalker", number: typeRawData["Planeswalker"] })
      }

      // TODO: Do this in a more rigid, but determinative way so they are in a
      // consistent order in the graph?
      // Put the color data in the form for the charts
      let colorData = []
      for (var key2 in colorRawData) {
        colorData.push({ color: key2, number: colorRawData[key2] })
      }

      // Create a color data set that also includes the colorless nonland cards
      let colorDataWithColorless = JSON.parse(JSON.stringify(colorData))
      if (numColorless > 0) {
        colorDataWithColorless.push({ color: "Colorless", number: numColorless })
      }

      // Put the pip data in the form for the charts
      let colorMap = { Colorless: "#8e8e93", White: "#ffcc00", Blue: "#5ac8fa", Black: "#242526", Red: "#ff3b30", Green: "#4cd964", }
      let pipsData = []
      for (var key3 in pipsRawData) {
        pipsData.push({ color: key3, number: pipsRawData[key3] })
      }

      // Create the dataset that includes colorless cards
      let pipsDataWithColorless = JSON.parse(JSON.stringify(pipsData))
      if (numColorlessPips > 0)
        pipsDataWithColorless.push({ color: 'Colorless', number: numColorlessPips })

      // Map the JS cards to react elements, and store those elements in a list. This list
      // will be the table rows for the decklist above
      let list = jsCards.map(card => {
        return (
          <ListEntry key={card.name} card={card} />
        )
      })

      console.log(typeCardLists)

      // Store all of the analysis data in the state for the other components to use
      this.setState({
        deck: jsCards, listOfCards: list, loaded: true, loadingDeck: false, loadError: false,
        cmcData: cmcData, cmcDataNoLands: cmcDataNoLands, typeData: typeData, colorData: colorData, pipsData: pipsData,
        TCGCost: tcgTotalCost, CKCost: ckTotalCost, TCGMax: maxTCG, CKMax: maxCK,
        colors: colorMap, colorDataWithColorless: colorDataWithColorless, pipsDataWithColorless: pipsDataWithColorless,
        typeColorMap: typeColorMap, deckName: deckName, typeCardLists: typeCardLists, colorCardLists: colorCardLists
      })
    });
  }
};

/**
 * A class that represents all the information we need about MTGCards in
 * beautiful, JavaScript object form :)
 */
class MTGCard {
  constructor(name, colors, manaCost, cmc, types, modifier, tcgprice, ckprice, setCode, setName, multiverseID) {
    this.name = name          // The name of the card
    this.colors = colors      // The colors that the card is
    this.manaCost = manaCost  // The mana cost of this card
    this.cmc = cmc;           // The cmc of this card
    this.types = types;       // An array of all the types this card has
    this.modifier = modifier  // "Normal" for cards that arent foil, "Foil" for cards that are foil
    this.tcgprice = tcgprice  // The price at TCGPlayer for this card and condition
    this.ckprice = ckprice    // The price at Card Kingdom for this card and condition
    this.setCode = setCode;   // The set code for the expansion this card is from
    this.setName = setName;   // The name of the set that this card is from
    this.multiverseID = multiverseID;
  }

  /**
   * A Small helper function that prints from relevant information about this card, for
   * debugging purposes.
   */
  displayInConsole() {
    console.log("{ name: " + this.name + ", colors: " + this.colors + ", manaCost: " + this.manaCost + ", type: " + this.modifier + ", TCGPlayer price: " + this.tcgprice + ", Card Kingdom price: " + this.ckprice);
  }
}