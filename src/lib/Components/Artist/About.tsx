import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, StyleSheet, View, ViewProperties } from "react-native"

import NavButton from "../Buttons/NavigationButton"
import RelatedArtists from "../RelatedArtists"
import Separator from "../Separator"
import Articles from "./Articles"
import Biography from "./Biography"

interface Props extends ViewProperties {
  artist: any
}

class About extends React.Component<Props, null> {
  render() {
    return (
      <View>
        {this.biography()}
        {this.articles()}
        {this.relatedArtists()}
      </View>
    )
  }

  biography() {
    if (this.props.artist.has_metadata) {
      return (
        <View>
          <Biography artist={this.props.artist} />
          {this.auctionResults()}
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }

  auctionResults() {
    if (this.props.artist.is_display_auction_link) {
      // Keeps the same margins as the bio text
      const sideMargin = Dimensions.get("window").width > 700 ? 50 : 20
      const url = `/artist/${this.props.artist.id}/auction-results`
      return (
        <NavButton title="Auction Results" href={url} style={{ marginLeft: sideMargin, marginRight: sideMargin }} />
      )
    }
  }

  articles() {
    if (this.props.artist.articles.length) {
      return (
        <View>
          <Articles articles={this.props.artist.articles} />
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }

  relatedArtists() {
    return this.props.artist.related_artists.length
      ? <RelatedArtists artists={this.props.artist.related_artists} />
      : null
  }
}

const styles = StyleSheet.create({
  sectionSeparator: {
    marginBottom: 20,
  },
})

export default createFragmentContainer(
  About,
  graphql`
    fragment About_artist on Artist {
      has_metadata
      is_display_auction_link
      id
      ...Biography_artist
      related_artists: artists(size: 16) {
        ...RelatedArtists_artists
      }
      articles {
        ...Articles_articles
      }
    }
  `
)
