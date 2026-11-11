export const QUESTS = [
  {id:'primeira-caca',name:'O primeiro despertar',description:'Derrote 5 Errantes ou criaturas na planície.',kind:'kills',required:5,gold:80,xp:60,essence:12},
  {id:'portal',name:'Além da primeira fenda',description:'Conclua uma incursão e derrote o Arconte.',kind:'gateClears',required:1,gold:220,xp:180,essence:40},
  {id:'legiao',name:'O primeiro eco',description:'Invoque um Eco Sombrio após desbloquear a habilidade.',kind:'shadowCount',required:1,gold:70,xp:75,essence:18},
  {id:'ascensao',name:'Marca de crescimento',description:'Alcance o nível 5.',kind:'level',required:5,gold:150,xp:100,essence:30},
  {id:'cacador',name:'Caçador persistente',description:'Elimine 40 inimigos no mundo ou nas fendas.',kind:'kills',required:40,gold:400,xp:250,essence:55},
  {id:'soberania',name:'O ciclo continua',description:'Conclua três portais.',kind:'gateClears',required:3,gold:700,xp:420,essence:85}
];
export function questProgress(character,quest){return Math.min(quest.required,Number(character[quest.kind]||0));}
export function questAvailable(character,quest){return !character.questClaimed.includes(quest.id)&&questProgress(character,quest)>=quest.required;}
