/*
 * Copyright (C) 2008-2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/*
 * halbae87: this project is created from Soft Keyboard Sample source
 */

package com.halbae87.koreanbasicime;

import android.annotation.SuppressLint;
import android.graphics.Rect;
import android.inputmethodservice.InputMethodService;
import android.inputmethodservice.Keyboard;
import android.inputmethodservice.KeyboardView;
import android.text.method.MetaKeyKeyListener;
import android.util.Log;
import android.view.KeyCharacterMap;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.CompletionInfo;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;

import java.util.ArrayList;
import java.util.List;


/*
  just for reference
  Hangul/English:    KEYCODE_KANA (218)
  Hanja:             KEYCODE_EISU (212)
  Win (Left):        KEYCODE_META_LEFT (117)
  Menu:                KEYCODE_MENU (82)
  sys. req./prtscr: KEYCODE_SYSRQ (120)
 */
/**
 * Example of writing an input method for a soft keyboard.  This code is
 * focused on simplicity over completeness, so it should in no way be considered
 * to be a complete soft keyboard implementation.  Its purpose is to provide
 * a basic example for how you would get started writing an input method, to
 * be fleshed out as appropriate.
 */



@SuppressLint("InlinedApi")
@SuppressWarnings("unused")
public class SoftKeyboard extends InputMethodService 
        implements KeyboardView.OnKeyboardActionListener {
    static final boolean DEBUG = false;
    
    /**
     * This boolean indicates the optional example code for performing
     * processing of hard keys in addition to regular text generation
     * from on-screen interaction.  It would be used for input methods that
     * perform language translations (such as converting text entered on 
     * a QWERTY keyboard to Chinese), but may not be used for input methods
     * that are primarily intended to be used for on-screen text entry.
     */
    static final boolean PROCESS_HARD_KEYS = true;
    private final String TAG = "SoftKeyboard"; 
    
    private KeyboardView mInputView;
    // no suggestion for Korean
    // private CandidateView mCandidateView;
    // private CompletionInfo[] mCompletions;
    
    private StringBuilder mComposing = new StringBuilder();
    // private boolean mPredictionOn;
    // private boolean mCompletionOn;
    private int mLastDisplayWidth;
    private boolean mCapsLock;
    private long mLastShiftTime;
    private long mMetaState;
    private boolean mHwShift = false;
    
    private LatinKeyboard mSymbolsKeyboard;
    private LatinKeyboard mSymbolsShiftedKeyboard;
    private LatinKeyboard mQwertyKeyboard;

    // special key definitions.
    static final int KEYCODE_HANGUL = 218; // KeyEvent.KEYCODE_KANA is available from API 16
    static final int KEYCODE_HANJA = 212;  // KeyEvent.KEYCODE_EISU is available from API 16
    static final int KEYCODE_WIN_LEFT = 117; // KeyEvent.KEYCODE_META_LEFT is available from API 11
    static final int KEYCODE_SYSREQ = 120; // KeyEvent.KEYCODE_SYSREQ is available from API 11
  
    private boolean mHwCapsLock = false;
    
    private LatinKeyboard mKoreanKeyboard;
    private LatinKeyboard mKoreanShiftedKeyboard;
    private LatinKeyboard mBackupKeyboard;
    
    private LatinKeyboard mCurKeyboard;
    
    private String mWordSeparators;
    
    private KoreanAutomata kauto;
    private boolean mNoKorean = false;
    
    
    EditorInfo mAttribute;
    /**
     * Main initialization of the input method component.  Be sure to call
     * to super class.
     */
     
    @Override public void onCreate() {
        super.onCreate();
        mWordSeparators = getResources().getString(R.string.word_separators);
        
        // enable for debug purpose only. otherwise, it will stuck here.
        // android.os.Debug.waitForDebugger();
        mAttribute = null;
    }
    
    /**
     * This is the point where you can do all of your UI initialization.  It
     * is called after creation and any configuration change.
     */
    @Override public void onInitializeInterface() {
        if (mQwertyKeyboard != null) {
            // Configuration changes can happen after the keyboard gets recreated,
            // so we need to be able to re-build the keyboards if the available
            // space has changed.
            int displayWidth = getMaxWidth();
            if (displayWidth == mLastDisplayWidth) return;
            mLastDisplayWidth = displayWidth;
        }
        kauto = new KoreanAutomata();
        mQwertyKeyboard = new LatinKeyboard(this, R.xml.qwerty);
        mSymbolsKeyboard = new LatinKeyboard(this, R.xml.symbols);
        mSymbolsShiftedKeyboard = new LatinKeyboard(this, R.xml.symbols_shift);
        mKoreanKeyboard = new LatinKeyboard(this, R.xml.korean);
        mKoreanShiftedKeyboard = new LatinKeyboard(this, R.xml.korean_shifted);
        mBackupKeyboard = null; 
    }
    
    /**
     * Called by the framework when your view for creating input needs to
     * be generated.  This will be called the first time your input method
     * is displayed, and every time it needs to be re-created such as due to
     * a configuration change.
     */
    @Override public View onCreateInputView() {
    	// Log.v(TAG,"onCreateInputView ---- enter");
        mInputView = (KeyboardView) getLayoutInflater().inflate(
                R.layout.input, null);
        mInputView.setOnKeyboardActionListener(this);
        mInputView.setKeyboard(mQwertyKeyboard);
    	// Log.v(TAG,"onCreateInputView ---- leave");
        return mInputView;
    }

    /**
     * Called by the framework when your view for showing candidates needs to
     * be generated, like {@link #onCreateInputView}.
     */
    /* no candidate window for Korean
    @Override public View onCreateCandidatesView() {
        mCandidateView = new CandidateView(this);
        mCandidateView.setService(this);
        return mCandidateView;
    }
    */
    
    // add this. no need full screen IME mode for this IME. ---- KGS need to check...
    
    @Override
    public void onUpdateExtractingVisibility(EditorInfo ei) {
        ei.imeOptions |= EditorInfo.IME_FLAG_NO_EXTRACT_UI;
        ei.imeOptions |= EditorInfo.IME_FLAG_NO_FULLSCREEN;        
        super.onUpdateExtractingVisibility(ei);
    }
    

    /**
     * This is the main point where we do our initialization of the input method
     * to begin operating on an application.  At this point we have been
     * bound to the client, and are now receiving all of the detailed information
     * about the target of our edits.
     */
    @Override public void onStartInput(EditorInfo attribute, boolean restarting) {
        super.onStartInput(attribute, restarting);
    	// Log.v(TAG,"onStartInput ---- enter");
        mAttribute = attribute;
        
        // Reset our state.  We want to do this even if restarting, because
        // the underlying state of the text editor could have changed in any way.
        mComposing.setLength(0);
        // updateCandidates();
        
        if (!restarting) {
            // Clear shift states.
            mMetaState = 0;
        }
        
        // mPredictionOn = false;
        // mCompletionOn = false;
        // mCompletions = null;
        kauto.FinishAutomataWithoutInput();
        
        // We are now going to initialize our state based on the type of
        // text being edited.
        switch (attribute.inputType&EditorInfo.TYPE_MASK_CLASS) {
            case EditorInfo.TYPE_CLASS_NUMBER:
            case EditorInfo.TYPE_CLASS_DATETIME:
                // Numbers and dates default to the symbols keyboard, with
                // no extra features.
                mCurKeyboard = mSymbolsKeyboard;
                mNoKorean = true;
                if (kauto.IsKoreanMode())
                	kauto.ToggleMode();
                break;
                
            case EditorInfo.TYPE_CLASS_PHONE:
                // Phones will also default to the symbols keyboard, though
                // often you will want to have a dedicated phone keyboard.
                mCurKeyboard = mSymbolsKeyboard;
                mNoKorean = true;
                if (kauto.IsKoreanMode())
                	kauto.ToggleMode();
                break;
                
            case EditorInfo.TYPE_CLASS_TEXT:
                // This is general text editing.  We will default to the
                // normal alphabetic keyboard, and assume that we should
                // be doing predictive text (showing candidates as the
                // user types).
                
                // mPredictionOn = false;
                
                // We now look for a few special variations of text that will
                // modify our behavior.
                int variation = attribute.inputType &  EditorInfo.TYPE_MASK_VARIATION;
                if (variation == EditorInfo.TYPE_TEXT_VARIATION_PASSWORD ||
                        variation == EditorInfo.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) {
                    // Do not display predictions / what the user is typing
                    // when they are entering a password.
                    //mNoKorean = true;
                    // mPredictionOn = false;
                }
                
                if (mNoKorean || !kauto.IsKoreanMode())
                	mCurKeyboard = mQwertyKeyboard;
                else
                	mCurKeyboard = mKoreanKeyboard;
                //if (kauto.IsKoreanMode())
                //	kauto.ToggleMode();
                
                /* KGS, do I need these?
                if (variation == EditorInfo.TYPE_TEXT_VARIATION_EMAIL_ADDRESS 
                        || variation == EditorInfo.TYPE_TEXT_VARIATION_URI
                        || variation == EditorInfo.TYPE_TEXT_VARIATION_FILTER) {
                    // Our predictions are not useful for e-mail addresses
                    // or URIs.
                    mPredictionOn = false;
                }
                
                if ((attribute.inputType&EditorInfo.TYPE_TEXT_FLAG_AUTO_COMPLETE) != 0) {
                    // If this is an auto-complete text view, then our predictions
                    // will not be shown and instead we will allow the editor
                    // to supply their own.  We only show the editor's
                    // candidates when in fullscreen mode, otherwise relying
                    // own it displaying its own UI.
                    mPredictionOn = false;
                    mCompletionOn = isFullscreenMode();
                }
                */
                
                // We also want to look at the current state of the editor
                // to decide whether our alphabetic keyboard should start out
                // shifted.
                updateShiftKeyState(attribute);
                break;
                
            default:
                // For all unknown input types, default to the alphabetic
                // keyboard with no special features.
                // mCurKeyboard = mQwertyKeyboard;

            	if (kauto.IsKoreanMode())
                	mCurKeyboard = mKoreanKeyboard;
                else
                	mCurKeyboard = mQwertyKeyboard;
                updateShiftKeyState(attribute);
        }
        
        // Update the label on the enter key, depending on what the application
        // says it will do.
        mCurKeyboard.setImeOptions(getResources(), attribute.imeOptions);
    	// Log.v(TAG,"onStartInput ---- leave");
}

    @Override public void onFinishInputView(boolean finishingInput) {
        super.onFinishInputView(finishingInput);
    	// Log.v(TAG,"onFinishInputView ---- enter");
    	if (kauto.IsKoreanMode())
    		kauto.FinishAutomataWithoutInput();
		mKoreanKeyboard.setShifted(false);
    	// Log.v(TAG,"onFinishInputView ---- leave");
    }

    /**
     * This is called when the user is done editing a field.  We can use
     * this to reset our state.
     */
    
    @Override public void onFinishInput() {
        super.onFinishInput();
    	// Log.v(TAG,"onFinishInput ---- enter");
        
        // Clear current composing text and candidates.
        kauto.FinishAutomataWithoutInput();
        mNoKorean = false;
        /*
        InputConnection ic = getCurrentInputConnection();
        if (ic != null)
        	commitTyped(ic);
        */
        mComposing.setLength(0);
        // updateCandidates();
        
        // We only hide the candidates window when finishing input on
        // a particular editor, to avoid popping the underlying application
        // up and down if the user is entering text into the bottom of
        // its window.
        setCandidatesViewShown(false);
        
        mCurKeyboard = mQwertyKeyboard;
        if (mInputView != null) {
            // let's reset Korean input mode in soft keyboard mode. H/W keyboard will not be affected with this.
            // if (kauto.IsKoreanMode())
            //	kauto.ToggleMode();
            mInputView.closing();
        }
    	// Log.v(TAG,"onFinishInput ---- leave");
    }
    
    @Override public void onStartInputView(EditorInfo attribute, boolean restarting) {
        super.onStartInputView(attribute, restarting);
    	// Log.v(TAG,"onStartInputView ---- enter, restarting = " + restarting);
        mAttribute = attribute;
        // Apply the selected keyboard to the input view.
        if (kauto.IsKoreanMode())
            mCurKeyboard = mKoreanKeyboard;
        else
        {
            int type = (attribute.inputType&EditorInfo.TYPE_MASK_CLASS);
            switch (type) 
            {
            case EditorInfo.TYPE_CLASS_NUMBER:
            case EditorInfo.TYPE_CLASS_DATETIME:
            case EditorInfo.TYPE_CLASS_PHONE:
                mCurKeyboard = mSymbolsKeyboard;
                break;

            default:
                mCurKeyboard = mQwertyKeyboard;
                break;
            }
        }
        
        mInputView.setKeyboard(mCurKeyboard);
        mInputView.closing();
    	// Log.v(TAG,"onStartInputView ---- leave");
    }
    
    /**
     * Deal with the editor reporting movement of its cursor.
     */
    @Override public void onUpdateSelection(int oldSelStart, int oldSelEnd,
            int newSelStart, int newSelEnd,
            int candidatesStart, int candidatesEnd) {
        super.onUpdateSelection(oldSelStart, oldSelEnd, newSelStart, newSelEnd,
                candidatesStart, candidatesEnd);
        
        // If the current selection in the text view changes, we should
        // clear whatever candidate text we have.
        if (mComposing.length() > 0 && (newSelStart != candidatesEnd
                || newSelEnd != candidatesEnd)) {
            mComposing.setLength(0);
            // Log.v(TAG, "onUpdateSelection --- called");
            kauto.FinishAutomataWithoutInput();
            // updateCandidates();
            InputConnection ic = getCurrentInputConnection();
            if (ic != null) {
                ic.finishComposingText();
            }
        }
    }

    /**
     * This tells us about completions that the editor has determined based
     * on the current text in it.  We want to use this in fullscreen mode
     * to show the completions ourself, since the editor can not be seen
     * in that situation.
     */
    /* do nothing
    @Override public void onDisplayCompletions(CompletionInfo[] completions) {
        if (mCompletionOn) {
            mCompletions = completions;
            if (completions == null) {
                setSuggestions(null, false, false);
                return;
            }
            
            List<String> stringList = new ArrayList<String>();
            for (int i=0; i<(completions != null ? completions.length : 0); i++) {
                CompletionInfo ci = completions[i];
                if (ci != null) stringList.add(ci.getText().toString());
            }
            setSuggestions(stringList, true, true);
        }
    }
    */
    /**
     * This translates incoming hard key events in to edit operations on an
     * InputConnection.  It is only needed when using the
     * PROCESS_HARD_KEYS option.
     */
    private boolean translateKeyDown(int keyCode, KeyEvent event) {
    	// Log.v(TAG, "translateKeyDown() called");
        mMetaState = MetaKeyKeyListener.handleKeyDown(mMetaState, keyCode, event);
        int c = event.getUnicodeChar(MetaKeyKeyListener.getMetaState(mMetaState));
        mMetaState = MetaKeyKeyListener.adjustMetaAfterKeypress(mMetaState);
        InputConnection ic = getCurrentInputConnection();
        if (c == 0 || ic == null) {
            return false;
        }
        
        boolean dead = false;

        if ((c & KeyCharacterMap.COMBINING_ACCENT) != 0) {
            dead = true;
            c = c & KeyCharacterMap.COMBINING_ACCENT_MASK;
        }
        
        if (mComposing.length() > 0) {
            char accent = mComposing.charAt(mComposing.length() -1 );
            int composed = KeyEvent.getDeadChar(accent, c);

            if (composed != 0) {
                c = composed;
                mComposing.setLength(mComposing.length()-1);
            }
        }
        
        onKey(c, null);
        
        return true;
    }
    
    /**
     * Use this to monitor key events being delivered to the application.
     * We get first crack at them, and can either resume them or let them
     * continue to the app.
     */
    @SuppressWarnings({ })
	@Override public boolean onKeyDown(int keyCode, KeyEvent event) {
    	// Log.v(TAG, "onKeyDown - keyCode = " + event.keyCodeToString(keyCode) + " ("+ keyCode +")");
        if (event.isShiftPressed())
        {
            if (DEBUG)Log.d(TAG, "event.isShiftPressed() => true");
            mHwShift = true;
        }
        
        if (event.isCapsLockOn())
        {
            if (DEBUG)Log.d(TAG, "event.isCapsLockOn() => true");
            mHwCapsLock = true;
        }
    	// if ALT or CTRL meta keys are using, the key event should not be touched here and be passed through to. 
    	if ((event.getMetaState() & (KeyEvent.META_ALT_MASK | KeyEvent.META_CTRL_MASK)) == 0)   
    	{
	        switch (keyCode) {
	            case KeyEvent.KEYCODE_BACK:
	                // The InputMethodService already takes care of the back
	                // key for us, to dismiss the input method if it is shown.
	                // However, our keyboard could be showing a pop-up window
	                // that back should dismiss, so we first allow it to do that.
	                if (event.getRepeatCount() == 0 && mInputView != null) {
	                    if (mInputView.handleBack()) {
	                        return true;
	                    }
	                }
	                break;
	            case KeyEvent.KEYCODE_SPACE:
	            	if ( /* (event.getFlags() & event.FLAG_SOFT_KEYBOARD) != 0 && */!mNoKorean  && event.isShiftPressed())
	            	{
	        			if (mComposing.length() > 0)
	        			{
	        				InputConnection ic = getCurrentInputConnection();
	        				if (ic != null)
	        					commitTyped(ic);
	        			}
	            		if (kauto.IsKoreanMode())
	            		{
	            			kauto.FinishAutomataWithoutInput();
	            		}
	            		kauto.ToggleMode();
	            		// Log.v(TAG, "onKeyDown -- SHIFT SPACE. Korean Mode = " + kauto.IsKoreanMode());
	            		return true;
	            	}
	            	else
	            	{
	            		translateKeyDown(keyCode, event);
	                    return true;
	            	}
	//            	break;
	            
	            // for Korean Keyboard only. 
	            case KEYCODE_HANGUL:
	            	if (!mNoKorean)
	            	{
	            		// Log.v(TAG, "onKeyDown -- KEYCODE_HANGUL. Korean Mode = " + kauto.IsKoreanMode() +" Let's toggle it.");
	        			if (mComposing.length() > 0)
	        			{
	        				InputConnection ic = getCurrentInputConnection();
	        				if (ic != null)
	        					commitTyped(ic);
	        			}
	            		if (kauto.IsKoreanMode())
	            		{
	            			kauto.FinishAutomataWithoutInput();
	            		}
	            		kauto.ToggleMode();
	            		// consume this event.
	            		return true;
	            	}
	            	else
	            	{
	            		// Log.v(TAG, "onKeyDown -- KEYCODE_HANGUL. but Korean is not allowed in this context. ignore this.");
	            	}
	            	break;
	
	            case KeyEvent.KEYCODE_DEL:
	                // Special handling of the delete key: if we currently are
	                // composing text for the user, we want to modify that instead
	                // of let the application to the delete itself.
	                if (mComposing.length() > 0) {
	                    onKey(Keyboard.KEYCODE_DELETE, null);
	                    return true;
	                }
	                break;
	                
	            case KeyEvent.KEYCODE_ENTER:
	                // Let the underlying text editor always handle these.
	            	if (kauto.IsKoreanMode())
	            	{
	            		kauto.FinishAutomataWithoutInput();
	            	}
	                return false;
	                
	            default:
	                // For all other keys, if we want to do transformations on
	                // text being entered with a hard keyboard, we need to process
	                // it and do the appropriate action.
	                if (PROCESS_HARD_KEYS) {
	                    if (keyCode == KeyEvent.KEYCODE_SPACE
	                            && (event.getMetaState()&KeyEvent.META_ALT_ON) != 0) {
	                        // A silly example: in our input method, Alt+Space
	                        // is a shortcut for 'android' in lower case.
	                        InputConnection ic = getCurrentInputConnection();
	                        if (ic != null) {
	                            // First, tell the editor that it is no longer in the
	                            // shift state, since we are consuming this.
	                            ic.clearMetaKeyStates(KeyEvent.META_ALT_ON);
	                            keyDownUp(KeyEvent.KEYCODE_A);
	                            keyDownUp(KeyEvent.KEYCODE_N);
	                            keyDownUp(KeyEvent.KEYCODE_D);
	                            keyDownUp(KeyEvent.KEYCODE_R);
	                            keyDownUp(KeyEvent.KEYCODE_O);
	                            keyDownUp(KeyEvent.KEYCODE_I);
	                            keyDownUp(KeyEvent.KEYCODE_D);
	                            // And we consume this event.
	                            return true;
	                        }
	                    }
	                    if ( /* mPredictionOn && */ translateKeyDown(keyCode, event)) {
	                        return true;
	                    }
	                }
	        }
    	}
        return super.onKeyDown(keyCode, event);
    }

    /**
     * Use this to monitor key events being delivered to the application.
     * We get first crack at them, and can either resume them or let them
     * continue to the app.
     */
    @Override public boolean onKeyUp(int keyCode, KeyEvent event) {
        // If we want to do transformations on text being entered with a hard
        // keyboard, we need to process the up events to update the meta key
        // state we are tracking.
    	// Log.v(TAG, "onKeyUp - keyCode = " + event.keyCodeToString(keyCode));
        if (PROCESS_HARD_KEYS) {
            // if (mPredictionOn) {
                mMetaState = MetaKeyKeyListener.handleKeyUp(mMetaState, keyCode, event);
            // }
        }
        mHwShift = false;
        mHwCapsLock = false;
        
        return super.onKeyUp(keyCode, event);
    }

    /**
     * Helper function to commit any text being composed in to the editor.
     */
    private void commitTyped(InputConnection inputConnection) {
    	// Log.v(TAG, "commitTyped ------- mComposing = [" + mComposing +"] length = " + mComposing.length());
        if (mComposing.length() > 0) {
            inputConnection.commitText(mComposing, 1);
            mComposing.setLength(0);
            // updateCandidates();
        }
    }

    /**
     * Helper to update the shift state of our keyboard based on the initial
     * editor state.
     */
    // KGS need to fix..
    private void updateShiftKeyState(EditorInfo attr) {
        if (attr != null && mInputView != null)
        {  
        	if (mQwertyKeyboard == mInputView.getKeyboard()) 
        	{
	            int caps = 0;
	            EditorInfo ei = getCurrentInputEditorInfo();
	            if (ei != null && ei.inputType != EditorInfo.TYPE_NULL) {
	                caps = getCurrentInputConnection().getCursorCapsMode(attr.inputType);
	            }
	            // Log.v(TAG, "updateShiftKeyState - mCapsLock = " + mCapsLock + ", caps = " + caps);
	            mInputView.setShifted(mCapsLock || caps != 0);
        	}
        	else if (mKoreanShiftedKeyboard == mInputView.getKeyboard())
        	{
        		mKoreanShiftedKeyboard.setShifted(false);
        		mInputView.setKeyboard(mKoreanKeyboard);
        		mKoreanKeyboard.setShifted(false);
        	}
        }
    }
    
    /**
     * Helper to determine if a given character code is alphabetic.
     */
    private boolean isAlphabet(int code) {
        if (Character.isLetter(code)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Helper to send a key down / key up pair to the current editor.
     */
    private void keyDownUp(int keyEventCode) {
        getCurrentInputConnection().sendKeyEvent(
                new KeyEvent(KeyEvent.ACTION_DOWN, keyEventCode));
        getCurrentInputConnection().sendKeyEvent(
                new KeyEvent(KeyEvent.ACTION_UP, keyEventCode));
    }
    
    /**
     * Helper to send a character to the editor as raw key events.
     */
    private void sendKey(int keyCode) {
    	// Log.v(TAG, "sendKey ------- keyCode = " + keyCode);
        switch (keyCode) {
            case '\n':
                keyDownUp(KeyEvent.KEYCODE_ENTER);
                // Log.v(TAG, "sendKey ------- ENTER");
                break;
            default:
                if (keyCode >= '0' && keyCode <= '9') {
                    keyDownUp(keyCode - '0' + KeyEvent.KEYCODE_0);
                    // Log.v(TAG, "sendKey ------- DIGIT [" + (keyCode - '0') + "]");
                } else {
                    getCurrentInputConnection().commitText(String.valueOf((char) keyCode), 1);
                    // Log.v(TAG, "sendKey ------- maybe white space. valueOf [" + (String.valueOf((char) keyCode)) + "]");
                }
                break;
        }
    }

    // Implementation of KeyboardViewListener

    public void onKey(int primaryCode, int[] keyCodes) {
    	 // Log.v(TAG, "onKey - primaryCode = " + primaryCode);
    	if (isWordSeparator(primaryCode)) {
    		 // Log.v(TAG, " -- separator = [" + (char) primaryCode + "]");
            // Handle separator
        	if (mComposing.length() > 0) {
                commitTyped(getCurrentInputConnection());
            }
        	if (kauto.IsKoreanMode())
        		kauto.FinishAutomataWithoutInput();
        	sendKey(primaryCode);
    		if (mInputView != null)
    			updateShiftKeyState(getCurrentInputEditorInfo());
        } else if (primaryCode == Keyboard.KEYCODE_DELETE) {
            handleBackspace();
        } else if (primaryCode == Keyboard.KEYCODE_SHIFT) {
            handleShift();
        } else if (primaryCode == Keyboard.KEYCODE_CANCEL) {
            handleClose();
            return;
        } else if (primaryCode == Keyboard.KEYCODE_ALT) {
            // Show a menu or somethin'
        	 // Log.v(TAG,"onKey ---------- KEYCODE_ALT. let's use it as input mode change");
        	if (mInputView != null)
        	{
        		if (!mNoKorean)
        		{
	        		Keyboard current;
	        		if (kauto.IsKoreanMode())
	        		{
	        			 // Log.v(TAG, "   change keyboard view to English");
	        			current = mQwertyKeyboard;
	        		}
	        		else
	        		{
	        			 // Log.v(TAG, "   change keyboard view to Korean");
	        			current = mKoreanKeyboard;
	        		}
	        		mInputView.setKeyboard(current);
	                if (mComposing.length() > 0)
	                {
	                	commitTyped(getCurrentInputConnection());
	                }
	        		kauto.ToggleMode();
	        		if (current == mQwertyKeyboard || current == mKoreanKeyboard)
	        		{
	        			current.setShifted(false);
	        		}
        		}
        		else
        		{
        			 // Log.v(TAG, "   mNoKorean is ture. ignore the toggle key");
        		}
        	}
        } else if (primaryCode == Keyboard.KEYCODE_MODE_CHANGE
                && mInputView != null) {
            Keyboard current = mInputView.getKeyboard();
            if (current == mSymbolsKeyboard || current == mSymbolsShiftedKeyboard) {
            	if (mBackupKeyboard != null)
            		current =  mBackupKeyboard;
            	else 
            		current = mQwertyKeyboard;
            	mBackupKeyboard = null;
                // reset Korean input mode.
                if (current == mQwertyKeyboard && kauto.IsKoreanMode())
                 	kauto.ToggleMode();
            } else {
            	mBackupKeyboard = (LatinKeyboard) current;
                current = mSymbolsKeyboard;
                // need to submit current composition string
                if (mComposing.length() > 0)
                {
                	commitTyped(getCurrentInputConnection());
                }
            	if (kauto.IsKoreanMode())
            		kauto.FinishAutomataWithoutInput();
            }
            mInputView.setKeyboard(current);
            if (current == mSymbolsKeyboard) {
                current.setShifted(false);
            }
        } else {
            handleCharacter(primaryCode, keyCodes);
        }
    }

    public void onText(CharSequence text) {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;
        ic.beginBatchEdit();
        if (mComposing.length() > 0) {
            commitTyped(ic);
        }
        ic.commitText(text, 0);
        ic.endBatchEdit();
        updateShiftKeyState(getCurrentInputEditorInfo());
    }

    /**
     * Update the list of available candidates from the current composing
     * text.  This will need to be filled in by however you are determining
     * candidates.
     */
    /* no candidate window
    private void updateCandidates() {
        if (!mCompletionOn) {
            if (mComposing.length() > 0) {
                ArrayList<String> list = new ArrayList<String>();
                list.add(mComposing.toString());
                setSuggestions(list, true, true);
            } else {
                setSuggestions(null, false, false);
            }
        }
    }
    
    public void setSuggestions(List<String> suggestions, boolean completions,
            boolean typedWordValid) {
        if (suggestions != null && suggestions.size() > 0) {
            setCandidatesViewShown(true);
        } else if (isExtractViewShown()) {
            setCandidatesViewShown(true);
        }
        if (mCandidateView != null) {
            mCandidateView.setSuggestions(suggestions, completions, typedWordValid);
        }
    }
    */
    private void handleBackspace() {
    	// boolean cont = false;
    	if (kauto.IsKoreanMode())
    	{
    		int ret = kauto.DoBackSpace();
    		if (ret == KoreanAutomata.ACTION_ERROR)
    		{
    			// Log.v(TAG, "handleBackspace() - calling DoBackSpace() failed.");
    			//// Log.v(TAG, "  mCompositionString = [" + kauto.GetCompositionString()+"]");
    			// Log.v(TAG, "  mState = " + kauto.GetState());
    			updateShiftKeyState(getCurrentInputEditorInfo());
    			return;
    		}
    		if ((ret & KoreanAutomata.ACTION_UPDATE_COMPOSITIONSTR) != 0)
    		{
    			if (kauto.GetCompositionString() != "")
    			{
        			// mComposing.setLength(0);
    				if (mComposing.length() > 0)
    				{
    					mComposing.replace(mComposing.length() -1, mComposing.length(), kauto.GetCompositionString());
    					getCurrentInputConnection().setComposingText(mComposing, 1);
    				}
        			// mComposing.append(kauto.GetCompositionString());
        			
        			updateShiftKeyState(getCurrentInputEditorInfo());
        			return;
    			}
    			/*
    			else
    			{
    				cont = true;
    				// mComposing.setLength(0);
    				// getCurrentInputConnection().commitText("", 0);
    			}
    			*/
    		}
    		/*
    		if ((ret & KoreanAutomata.ACTION_USE_INPUT_AS_RESULT) != 0)
    		{
    			// Log.v(TAG, "handleBackspace() - something unexpected behavior happened during DoBackSpace()..");
    			// Log.v(TAG, "   - Let it go through.");
    			cont = true;
    		}
    		if (!cont)
    			return;
    			*/
    		// otherwise, just leave it.
    	}
        final int length = mComposing.length();
        if (length > 1) {
            mComposing.delete(length - 1, length);
            getCurrentInputConnection().setComposingText(mComposing, 1);
            // updateCandidates();
        } else if (length > 0) {
            mComposing.setLength(0);
            getCurrentInputConnection().commitText("", 0);
            // updateCandidates();
        } else {
            keyDownUp(KeyEvent.KEYCODE_DEL);
        }
        updateShiftKeyState(getCurrentInputEditorInfo());
    }

    private void handleShift() {
        if (mInputView == null) {
            return;
        }
        
        Keyboard currentKeyboard = mInputView.getKeyboard();
        if (mQwertyKeyboard == currentKeyboard) {
            // Alphabet keyboard
            checkToggleCapsLock();
            mInputView.setShifted(mCapsLock || !mInputView.isShifted());
        } 
        // add Korean Keyboards
        else if (currentKeyboard == mKoreanKeyboard)
        {
        	// Log.v(TAG,"handleShift -- shift on Korean Keyboard");
        	mKoreanKeyboard.setShifted(true);
            mInputView.setKeyboard(mKoreanShiftedKeyboard);
            mKoreanShiftedKeyboard.setShifted(true);
        }
        else if (currentKeyboard == mKoreanShiftedKeyboard)
        {
        	// Log.v(TAG,"handleShift -- shift off Korean Keyboard");
        	mKoreanShiftedKeyboard.setShifted(false);
            mInputView.setKeyboard(mKoreanKeyboard);
            mKoreanKeyboard.setShifted(false);
        }
        // end of Korean keyboard care..
        else if (currentKeyboard == mSymbolsKeyboard) {
            mSymbolsKeyboard.setShifted(true);
            mInputView.setKeyboard(mSymbolsShiftedKeyboard);
            mSymbolsShiftedKeyboard.setShifted(true);
        } else if (currentKeyboard == mSymbolsShiftedKeyboard) {
            mSymbolsShiftedKeyboard.setShifted(false);
            mInputView.setKeyboard(mSymbolsKeyboard);
            mSymbolsKeyboard.setShifted(false);
        }
    }
    
    private void handleCharacter(int primaryCode, int[] keyCodes) {
    	int keyState = InputTables.KEYSTATE_NONE;
    	
        if (isInputViewShown()) {
            if (mInputView.isShifted()) {
                primaryCode = Character.toUpperCase(primaryCode);
                keyState |= InputTables.KEYSTATE_SHIFT;
            }
        }
        // for h/w keyboard....
        if (mHwShift)
        	keyState |= InputTables.KEYSTATE_SHIFT;
         // Log.v(TAG, "handleCharacter() - POS 1");
        // jkchoi
        if (mHwCapsLock && isAlphabet(primaryCode))
        {
            if (mHwShift)
            {
                primaryCode = Character.toLowerCase(primaryCode);
            }
            else 
            {
                primaryCode = Character.toUpperCase(primaryCode);
                keyState |= InputTables.KEYSTATE_SHIFT;    
            }
            
        }
        else
        {
            Log.e(TAG,"handleCharacter() Alphabet error ~!!!");
        }
        
//        if (isAlphabet(primaryCode) && mPredictionOn ) {
        if (isAlphabet(primaryCode)) {
        	int ret = kauto.DoAutomata((char )primaryCode, keyState);
            if (ret < 0) {
                if (DEBUG) Log.v(TAG,"handleCharacter() - DoAutomata() call failed. primaryCode = " + primaryCode + " keyStete = " + keyState);
                if (kauto.IsKoreanMode())
                    kauto.ToggleMode();
            } else {
                int variation = 0;
                
                if ( mAttribute != null ) {
                    variation = mAttribute.inputType &  EditorInfo.TYPE_MASK_VARIATION;
                } else {
                    variation = -1000;
                }
                
                if (DEBUG) Log.d(TAG, "handleCharacter() variation = " + variation);
                if (DEBUG) Log.d(TAG, "mComposing.length()  = " + mComposing.length() );
                
                if ( !kauto.IsKoreanMode() && (variation == EditorInfo.TYPE_TEXT_VARIATION_PASSWORD)) {
                    if (mComposing.length() > 0) {
                        getCurrentInputConnection().commitText(mComposing, 1);
                        mComposing.setLength(0);
                    }
                    kauto.FinishAutomataWithoutInput();
                    getCurrentInputConnection().commitText(String.valueOf((char) primaryCode), 1);
                    updateShiftKeyState(getCurrentInputEditorInfo());
                    return;
	            } else {
	        		// debug block..
	        		 // Log.v(TAG, "handleCharacter - After calling DoAutomata()");
	        		 // Log.v(TAG, "   KoreanMode = [" + (kauto.IsKoreanMode()? "true" : "false") + "]");
	        		 // Log.v(TAG, "   CompleteString = [" + kauto.GetCompleteString() + "]");
	        		 // Log.v(TAG, "   CompositionString = [" + kauto.GetCompositionString() + "]");
	        		 // Log.v(TAG, "   State = [" + kauto.GetState() + "]");
	        		 // Log.v(TAG, "   ret = [" + ret + "]");
	        		
                    if ((ret & KoreanAutomata.ACTION_UPDATE_COMPLETESTR) != 0) {
						// Log.v(TAG, "--- UPDATE_COMPLETESTR");
						// mComposing.setLength(0);
						if (mComposing.length() > 0)
							mComposing.replace(mComposing.length() - 1, mComposing.length(), kauto.GetCompleteString());
						else
							mComposing.append(kauto.GetCompleteString());
						
						if (mComposing.length() > 0) {
							getCurrentInputConnection().setComposingText(mComposing, 1);
							// commitTyped(getCurrentInputConnection());
							if (kauto.IsKoreanMode() && (variation == EditorInfo.TYPE_TEXT_VARIATION_PASSWORD)
									&& (!kauto.GetCompleteString().equalsIgnoreCase(""))) {
								getCurrentInputConnection().commitText(mComposing, 1);
								mComposing.setLength(0);
							}
						}
		        	}
                    
	        		if ((ret & KoreanAutomata.ACTION_UPDATE_COMPOSITIONSTR) != 0)
		        	{
	        			// Log.v(TAG, "--- UPDATE_COMPOSITIONSTR");
		        		// mComposing.setLength(0);
	        			if ((mComposing.length() > 0) && ((ret & KoreanAutomata.ACTION_UPDATE_COMPLETESTR) == 0) && ((ret & KoreanAutomata.ACTION_APPEND) == 0))
	        				mComposing.replace(mComposing.length()-1, mComposing.length(), kauto.GetCompositionString());
	        			else 
	        				mComposing.append(kauto.GetCompositionString());
		        		getCurrentInputConnection().setComposingText(mComposing, 1);
		        	}
	            }
            }
    		if ((ret & KoreanAutomata.ACTION_USE_INPUT_AS_RESULT) != 0)
    		{
    			// Log.v(TAG, "--- USE_INPUT_AS_RESULT");
	            mComposing.append((char) primaryCode);
	            getCurrentInputConnection().setComposingText(mComposing, 1);
    		}
            updateShiftKeyState(getCurrentInputEditorInfo());
            // updateCandidates();
        } else {
        	/*
        	 // Log.v(TAG, "handleCharacter() - POS 2");
        	int ret = kauto.DoAutomata((char )primaryCode, keyState);
        	if (ret < 0)
        	{
        		 // Log.v(TAG,"handleCharacter() - DoAutomata() call failed. primaryCode = " + primaryCode + " keyStete = " + keyState);
        		if (kauto.IsKoreanMode())
        			kauto.ToggleMode();
        	}
        	else 
        	{
        		 // Log.v(TAG, "handleCharacter - After calling DoAutomata()");
        		 // Log.v(TAG, "   KoreanMode = [" + (kauto.IsKoreanMode()? "true" : "false") + "]");
        		 // Log.v(TAG, "   CompleteString = [" + kauto.GetCompleteString() + "]");
        		 // Log.v(TAG, "   CompositionString = [" + kauto.GetCompositionString() + "]");
        		 // Log.v(TAG, "   State = [" + kauto.GetState() + "]");
        		 // Log.v(TAG, "   ret = [" + ret + "]");
        		if ((ret & KoreanAutomata.ACTION_UPDATE_COMPLETESTR) != 0)
	        	{
        			// Log.v(TAG, " update complete string - " + kauto.GetCompleteString());
	        		// mComposing.setLength(0);
        			if (mComposing.length() > 0)
        				mComposing.replace(mComposing.length()-1, mComposing.length(), kauto.GetCompleteString());
        			else 
        				mComposing.append(kauto.GetCompleteString());
	        		// mComposing.append(kauto.GetCompleteString());
	            	if (mComposing.length() > 0) {
	            		getCurrentInputConnection().setComposingText(mComposing, 1);
	                    // commitTyped(getCurrentInputConnection());
	                }
	        	}
        		if ((ret & KoreanAutomata.ACTION_UPDATE_COMPOSITIONSTR) != 0)
	        	{
        			// Log.v(TAG, " update composition string - " + kauto.GetCompositionString());
	        		// mComposing.setLength(0);
        			if ((mComposing.length() > 0) && ((ret & KoreanAutomata.ACTION_UPDATE_COMPLETESTR) == 0))
        				mComposing.replace(mComposing.length()-1, mComposing.length(), kauto.GetCompositionString());
        			else 
        				mComposing.append(kauto.GetCompositionString());
	        		// mComposing.append(kauto.GetCompositionString());
	        		if (mComposing.length() > 0) {
	        			getCurrentInputConnection().setComposingText(mComposing, 1);
	        		}
	        	}
        	}
    		if ((ret & KoreanAutomata.ACTION_USE_INPUT_AS_RESULT) != 0)
    		{
                getCurrentInputConnection().commitText(
                        String.valueOf((char) primaryCode), 1);
    		}
            // updateShiftKeyState(getCurrentInputEditorInfo());
//            getCurrentInputConnection().commitText(
//                    String.valueOf((char) primaryCode), 1);
        	*/
        	// Log.v(TAG,"handleCharacter --- non-alphabet primaryCode = [" + (char)primaryCode + "]");
    		if (mComposing.length() > 0) {
    			getCurrentInputConnection().commitText(mComposing, 1);
    			mComposing.setLength(0);
    		}
			kauto.FinishAutomataWithoutInput();
            getCurrentInputConnection().commitText(String.valueOf((char) primaryCode), 1);
        }
    }

    private void handleClose() {
        commitTyped(getCurrentInputConnection());
        requestHideSelf(0);
        mInputView.closing();
    }

    private void checkToggleCapsLock() {
        long now = System.currentTimeMillis();
        if (mLastShiftTime + 800 > now) {
            mCapsLock = !mCapsLock;
            mLastShiftTime = 0;
        } else {
            mLastShiftTime = now;
        }
    }
    
    private String getWordSeparators() {
        return mWordSeparators;
    }
    
    public boolean isWordSeparator(int code) {
        String separators = getWordSeparators();
        return separators.contains(String.valueOf((char)code));
    }

    /* no candidate view for Korean. at least, not now.
    public void pickDefaultCandidate() {
        pickSuggestionManually(0);
    }
    
    public void pickSuggestionManually(int index) {
        if (mCompletionOn && mCompletions != null && index >= 0
                && index < mCompletions.length) {
            CompletionInfo ci = mCompletions[index];
            getCurrentInputConnection().commitCompletion(ci);
            if (mCandidateView != null) {
                mCandidateView.clear();
            }
            updateShiftKeyState(getCurrentInputEditorInfo());
        } else if (mComposing.length() > 0) {
            // If we were generating candidate suggestions for the current
            // text, we would commit one of them here.  But for this sample,
            // we will just commit the current text.
            commitTyped(getCurrentInputConnection());
        }
    }
    */
    public void pickSuggestionManually(int index) {} // just fake it to build.

    
    public void swipeRight() {
//        if (mCompletionOn) {
//            pickDefaultCandidate();
//        }
    }
    
    public void swipeLeft() {
        handleBackspace();
    }

    public void swipeDown() {
        handleClose();
    }

    public void swipeUp() {
    }
    
    public void onPress(int primaryCode) {
    }
    
    public void onRelease(int primaryCode) {
    }
}
