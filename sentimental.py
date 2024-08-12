from textblob import TextBlob

def get_sentiment(feedback):
    analysis = TextBlob(feedback)
    if analysis.sentiment.polarity > 0:
        return 'Positive'
    elif analysis.sentiment.polarity == 0:
        return 'Neutral'
    else:
        return 'Negative'
