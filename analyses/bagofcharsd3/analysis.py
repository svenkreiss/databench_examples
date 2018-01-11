import databench


class BagOfChars(databench.Analysis):

    @databench.on
    def connected(self):
        yield self.sentence('type a phrase')

    @databench.on
    def sentence(self, sentence):
        """Takes a sentence and counts the characters."""
        counts = {}
        for c in sentence.lower():
            if ord(c) < ord('a') or \
               ord(c) > ord('z'):
                continue
            if c not in counts:
                counts[c] = sentence.count(c)

        yield self.emit('log', counts)
        yield self.set_state(sentence=sentence, counts=counts)
