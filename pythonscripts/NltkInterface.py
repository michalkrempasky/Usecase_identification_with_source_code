import nltk as nl
from nltk.corpus import wordnet as wn
from xmlrpc.server import SimpleXMLRPCServer as xs
from xmlrpc.server import SimpleXMLRPCRequestHandler as rh


def posAssign(sentence):
    print("called"+sentence)
    tokenizedtext = nl.word_tokenize(sentence)
    print(tokenizedtext)
    posTagged = nl.pos_tag(tokenizedtext)
    #print(posTagged)
    return posTagged

def simwordsFind(worditself,type):
    print(worditself,type)
    word=(worditself+'.'+type+'.01')
    #print("word "+word)
    synseting=wn.synsets(worditself)
    #print(synseting)
    list=[]
    for s in synseting:
        #print(s)
        #print(s.pos())
        if s.pos()==type:
            #print(s.lemma_names())
            if s.lemma_names() in list:
                pass
            else:
                list.extend(s.lemma_names())
        for h in s.hypernyms():
            if h.pos() == type:
                if h.lemma_names() in list:
                    pass
                else:
                    list.extend(h.lemma_names())
                #print(h.lemma_names())

        for h in s.hyponyms():
            if h.pos() == type:
                if h.lemma_names() in list:
                    pass
                else:
                    list.extend(h.lemma_names())
                #print(h.lemma_names())
    print(list)
    return list



class RequestHandler(rh):
    rpc_paths=('/')

server= xs(("localhost",9000),requestHandler=RequestHandler)

server.register_introspection_functions()

server.register_function(posAssign,'postag')
server.register_function(simwordsFind,'sim')

try:
    print ('Use Control-C to exit')
    server.serve_forever()
except KeyboardInterrupt:
    print ('Exiting')