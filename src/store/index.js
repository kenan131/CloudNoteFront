import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
  //笔记数据
  bookData: "",
  noteBookList:[],
  bookList:[],
  curNoteBookIndex: "",
  curBookIndex: "",
  bookSaveStatus:true,
  updateDataTime:"",
  lookBookCurId:""
};

// 创建Store对象
const store = new Vuex.Store({
  state,
  mutations: {
    setBookData(state, data) {
      state.bookData = data;
    },
    setcurNoteBookIndex(state, data) {
        state.curNoteBookIndex=data;
    },
    setcurBookIndex(state,data){
        state.curBookIndex=data;
    },
    setBookList(state,data){
      state.bookList=data;
    },
    setNoteBookList(state,data){
      state.noteBookList=data;
    },
    setBookSaveStatus(state,data){
      state.bookSaveStatus=data;
    },
    setUpdateDateTime(state,data){
      state.updateDataTime=data;
    },
    setLooklookBookCurId(state,data){
      state.lookBookCurId=data;
    }
  }
});

// 挂载Vue实例
export default store;
