import databench


class BagOfChars(databench.Analysis):

    def on_sentence(self, sentence):
        """Takes a sentence and counts the characters."""
        counts = {}
        for c in sentence.lower():
            if ord(c) < ord('a') or \
               ord(c) > ord('z'):
                continue
            if c not in counts:
                counts[c] = sentence.count(c)

        self.emit('log', counts)
        self.data['counts'] = counts
