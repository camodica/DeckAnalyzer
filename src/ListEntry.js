
import React from 'react';
import './ListEntry.css'
// import { Tooltip } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default class ListEntry extends React.Component {
    constructor(props) {
        super(props)
        this.card = this.props.card

        this.tcgURL = "https://www.tcgplayer.com/search/all/product?q=" + encodeURI(this.card.name)
        this.ckURL = "https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=" + encodeURI(this.card.name)

        // TODO: dig deeper into the API and find out a way for direct links
        // or how to test to see if a direct link is bogus

        // Use https://www.seekpng.com/ima/u2w7w7w7w7a9e6e6/ for foil card overlay?

        // https://api.scryfall.com/cards/named?fuzzy=EternalWitness&set=MB1&format=image&version=large

        // https://scryfall.com/search?q=witness&unique=cards&as=grid&order=name

        this.state = { tooltipOpen: false }
    }

    render() {
        return (
            <tr>
                <td>
                    {(this.card.modifier === "Foil") ?
                        <div id="gradient" className="cell">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 0 }}
                                    overlay={
                                        <Tooltip id={"deck" + this.card.multiverseID} className="tooltip">
                                            <div style={{ position: 'relative' }}>
                                                <img src={"https://api.scryfall.com/cards/named?fuzzy=" + encodeURI(this.card.name) + "&set=" + encodeURI(this.card.setCode) + "&format=image&version=normal"} alt={this.card.name} style={{ width: "223px", height: "310px" }}/>
                                                <img src={"https://www.vippng.com/png/full/467-4672380_rainbow-overlay-png-for-free-download-mtg-card.png"} alt={'badload'} style={{ width: "223px", height: "310px", position: 'absolute', top: '0', left: '0', opacity: '1.0' }} />
                                            </div>
                                        </Tooltip>}>
                                    <a className="gradient" id={"deck" + this.card.multiverseID} href={"https://scryfall.com/search?q=" + encodeURI(this.card.name + " set:" + this.card.setCode)} target="_blank" rel='noopener noreferrer'>{this.card.name}</a>
                                </OverlayTrigger>
                        </div>
                        :
                        <div className="cell">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 0 }}
                                    overlay={
                                        <Tooltip id={"deck" + this.card.multiverseID} className="tooltip">
                                                <img src={"https://api.scryfall.com/cards/named?fuzzy=" + encodeURI(this.card.name) + "&set=" + encodeURI(this.card.setCode) + "&format=image&version=normal"} alt={this.card.name} style={{ width: "223px", height: "310px" }} />
                                            {/* <img style={{ position: "absolute", top: '0'}} src={"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=" + this.card.multiverseID} alt={this.card.name} style={{ width: "223px", height: "310px", opacity: '1' }} />  */}
                                        </Tooltip>}
                                >

                                    <a id={"deck" + this.card.multiverseID} href={"https://scryfall.com/search?q=" + encodeURI(this.card.name + " set:" + this.card.setCode)} target="_blank" rel='noopener noreferrer'>{this.card.name}</a>

                                </OverlayTrigger>
                        </div>
                    }
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>

                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        {this.card.setCode.toUpperCase()}
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.tcgURL} target="_blank" rel='noopener noreferrer'>
                            {(this.card.tcgprice > 0) ? '$' + this.card.tcgprice : "$---"}
                        </a>
                    </div>
                </td>
                <td>
                    <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                        <a href={this.ckURL} target="_blank" rel='noopener noreferrer'>
                            {(this.card.ckprice > 0) ? '$' + this.card.ckprice : "$---"}
                        </a>
                    </div>
                </td>
            </tr>
        );
    }

    // Replaces all ' with nothing and spaces with -
    // makes all characters lowercase
    escapeString(string) {
        string = string.toLowerCase()
        string = string.replace("//", "")
        string = string.replace(/,/g, "")
        string = string.replace(/'/g, "")
        string = string.replace(/ /g, "-")
        return string
    }
}