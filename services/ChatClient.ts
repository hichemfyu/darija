import { ChatMessage } from '@/data/mockData';

export interface ChatOptions {
  phonetic?: boolean;
  french?: boolean;
  persona?: 'ami' | 'prof' | 'souk';
}

class ChatClient {
  private mockResponses = {
    ami: [
      {
        text: 'Ah wa3er! Kifash dayr?',
        phonetic: 'ah wa-3er! ki-fash da-yr?',
        translation: 'Ah super ! Comment ça va ?'
      },
      {
        text: 'Mezyan! Wach bghiti dir liouma?',
        phonetic: 'mez-yan! wach bgh-i-ti dir li-ou-ma?',
        translation: 'Bien ! Qu\'est-ce que tu veux faire aujourd\'hui ?'
      },
      {
        text: 'Kolchi mezyan? Ntmna tkoun bikhir.',
        phonetic: 'kol-chi mez-yan? n-tmna t-koun bi-khir.',
        translation: 'Tout va bien ? J\'espère que tu vas bien.'
      },
      {
        text: 'Wach kayn chi jdid?',
        phonetic: 'wach kayn chi jdid?',
        translation: 'Quoi de neuf ?'
      },
      {
        text: 'Yallah, nbdaw had lhadra!',
        phonetic: 'ya-llah, n-bdaw had l-had-ra!',
        translation: 'Allez, commençons cette conversation !'
      },
      {
        text: 'Hadi fikra mezyana! Ana kay3jbni had l7al.',
        phonetic: 'ha-di fik-ra mez-ya-na! a-na kay-3jb-ni had l-7al.',
        translation: 'C\'est une bonne idée ! J\'aime cette situation.'
      },
      {
        text: 'Kolchi mezyan? Ntmna tkoun bikhir.',
        phonetic: 'kol-chi mez-yan? n-tmna t-koun bi-khir.',
        translation: 'Tout va bien ? J\'espère que tu vas bien.'
      },
      {
        text: 'Wach kayn chi jdid?',
        phonetic: 'wach kayn chi jdid?',
        translation: 'Quoi de neuf ?'
      },
      {
        text: 'Yallah, nbdaw had lhadra!',
        phonetic: 'ya-llah, n-bdaw had l-had-ra!',
        translation: 'Allez, commençons cette conversation !'
      },
      {
        text: 'Hadi fikra mezyana! Ana kay3jbni had l7al.',
        phonetic: 'ha-di fik-ra mez-ya-na! a-na kay-3jb-ni had l-7al.',
        translation: 'C\'est une bonne idée ! J\'aime cette situation.'
      }
    ],
    prof: [
      {
        text: 'Mezyan bzef! Had lkelma kayna f darija klasikia.',
        phonetic: 'mez-yan bzef! had l-kel-ma kay-na f da-ri-ja kla-si-kia.',
        translation: 'Très bien ! Ce mot existe dans le darija classique.'
      },
      {
        text: 'Hsent! Waqila tqeder tgoul had joumla kamla b darija?',
        phonetic: 'h-sent! wa-qi-la t-qe-der t-goul had joum-la kam-la b da-ri-ja?',
        translation: 'Excellent ! Peux-tu dire cette phrase complète en darija ?'
      },
      {
        text: 'F darija, hadchi kayban b tariqat okhra. Wach bghiti t3rf akthar?',
        phonetic: 'f da-ri-ja, had-chi kay-ban b ta-ri-qat okh-ra. wach bgh-i-ti t-3rf ak-thar?',
        translation: 'En darija, cela se dit autrement. Veux-tu en savoir plus ?'
      },
      {
        text: 'Had lkelma katsta3ml f had ssiyaq.',
        phonetic: 'had l-kel-ma kat-sta3ml f had s-si-yaq.',
        translation: 'Ce mot est utilisé dans ce contexte.'
      },
      {
        text: 'Aji nchoufou l-qawa3id dyal had l-joumla.',
        phonetic: 'a-ji n-chou-fou l-qa-wa-3id dyal had l-joum-la.',
        translation: 'Voyons les règles de cette phrase.'
      },
      {
        text: 'F darija, hadchi kayban b tariqat okhra. Wach bghiti t3rf akthar?',
        phonetic: 'f da-ri-ja, had-chi kay-ban b ta-ri-qat okh-ra. wach bgh-i-ti t-3rf ak-thar?',
        translation: 'En darija, cela se dit autrement. Veux-tu en savoir plus ?'
      },
      {
        text: 'Had lkelma katsta3ml f had ssiyaq.',
        phonetic: 'had l-kel-ma kat-sta3ml f had s-si-yaq.',
        translation: 'Ce mot est utilisé dans ce contexte.'
      },
      {
        text: 'Aji nchoufou l-qawa3id dyal had l-joumla.',
        phonetic: 'a-ji n-chou-fou l-qa-wa-3id dyal had l-joum-la.',
        translation: 'Voyons les règles de cette phrase.'
      }
    ],
    souk: [
      {
        text: 'Marhba bik! Ash bghiti tshri?',
        phonetic: 'mar-h-ba bik! ash bgh-i-ti t-shri?',
        translation: 'Bienvenue ! Qu\'est-ce que tu veux acheter ?'
      },
      {
        text: 'Ashmen taman bghiti?',
        phonetic: 'ash-men ta-man bgh-i-ti?',
        translation: 'Quel prix veux-tu ?'
      },
      {
        text: 'Ashmen taman bghiti?',
        phonetic: 'ash-men ta-man bgh-i-ti?',
        translation: 'Quel prix veux-tu ?'
      },
      {
        text: 'Had tomobile zwin bzef! B kam?',
        phonetic: 'had to-mo-bi-le zwin bzef! b kam?',
        translation: 'Cette voiture est très belle ! Combien ?'
      },
      {
        text: 'Khod had l9diya, ghalia shwiya walakin mizana.',
        phonetic: 'khod had l-9di-ya, gha-li-a shwi-ya wa-la-kin mi-za-na.',
        translation: 'Prends cette marchandise, elle est un peu chère mais de qualité.'
      },
      {
        text: 'Wach bghiti chi haja okhra?',
        phonetic: 'wach bgh-i-ti chi ha-ja okh-ra?',
        translation: 'Voulez-vous autre chose ?'
      },
      {
        text: 'Nqder nkhdem lik taman.',
        phonetic: 'n-qder n-khdem lik ta-man.',
        translation: 'Je peux vous faire un prix.'
      },
      {
        text: 'Khod had l9diya, ghalia shwiya walakin mizana.',
        phonetic: 'khod had l-9di-ya, gha-li-a shwi-ya wa-la-kin mi-za-na.',
        translation: 'Prends cette marchandise, elle est un peu chère mais de qualité.'
      },
      {
        text: 'Wach bghiti chi haja okhra?',
        phonetic: 'wach bgh-i-ti chi ha-ja okh-ra?',
        translation: 'Voulez-vous autre chose ?'
      },
      {
        text: 'Nqder nkhdem lik taman.',
        phonetic: 'n-qder n-khdem lik ta-man.',
        translation: 'Je peux vous faire un prix.'
      }
    ]
  };

  async sendMessage(
    text: string, 
    options: ChatOptions = {}
  ): Promise<ChatMessage> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const { persona = 'ami' } = options;
    const responses = this.mockResponses[persona];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      text: randomResponse.text,
      isUser: false,
      timestamp: new Date(),
      phonetic: randomResponse.phonetic,
      translation: randomResponse.translation,
    };
  }

  async generateResponse(
    userMessage: string,
    context: string = 'general'
  ): Promise<ChatMessage> {
    // Mock intelligent response based on context
    const contextResponses: Record<string, any> = {
      'Commander au café': {
        text: 'Bghit wahad qahwa, afak. W zid liya sukar shwiya.',
        phonetic: 'bghit wa-had qah-wa, a-fak. w zid li-ya su-kar shwi-ya.',
        translation: 'Je voudrais un café, s\'il te plaît. Et ajoutez-moi un peu de sucre.'
      },
      'Prendre un taxi': {
        text: 'Taxi! Bghit nmshi l aeroporto. Qddach ghay akhdti?',
        phonetic: 'ta-xi! bghit nm-shi l ae-ro-por-to. qd-dash ghay akh-d-ti?',
        translation: 'Taxi ! Je veux aller à l\'aéroport. Combien allez-vous prendre ?'
      },
      'Demander son chemin': {
        text: 'Smahli, wach t3rf fin kayn l banque? Rah tlit.',
        phonetic: 'smah-li, wach t-3rf fin ka-yn l ban-que? rah t-lit.',
        translation: 'Excuse-moi, sais-tu où est la banque ? Je suis perdu.'
      }
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = contextResponses[context] || this.mockResponses.ami[0];
    
    return {
      id: Date.now().toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      phonetic: response.phonetic,
      translation: response.translation,
    };
  }
}

export const chatClient = new ChatClient();