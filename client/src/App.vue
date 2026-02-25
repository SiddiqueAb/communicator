<template>
  <!-- ════════════════════════════════════════════════════════════════════════
       ROOT SHELL
  ═════════════════════════════════════════════════════════════════════════ -->
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">

    <!-- ── HEADER ─────────────────────────────────────────────────────────── -->
    <header class="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-30">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0
                 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8
                 9-8s9 3.582 9 8z" />
          </svg>
          <span class="font-bold text-lg tracking-tight text-white">Communicator</span>
        </div>

        <!-- My ID badge -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">My ID</span>
          <div
            class="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 group cursor-pointer select-none"
            @click="copyId"
            title="Click to copy"
          >
            <span class="font-mono font-bold text-lg text-blue-400 tracking-widest">
              {{ myId || '——————' }}
            </span>
            <!-- Copy icon -->
            <svg
              v-if="!idCopied"
              class="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0
                   002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-green-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </header>

    <!-- ── MAIN ───────────────────────────────────────────────────────────── -->
    <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-6">

      <!-- ── CONNECT PANEL ────────────────────────────────────────────────── -->
      <section class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Connect to a friend
        </h2>
        <div class="flex gap-3 flex-wrap">
          <input
            v-model="friendIdInput"
            @keyup.enter="setFriend"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="Enter 6-digit ID…"
            class="flex-1 min-w-[160px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5
                   font-mono text-lg text-blue-300 placeholder-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition"
          />
          <button
            @click="setFriend"
            :disabled="friendIdInput.length !== 6"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                   disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition"
          >
            Connect
          </button>
        </div>

        <!-- Active session banner -->
        <Transition name="slide-down">
          <div
            v-if="connectedTo"
            class="mt-4 flex items-center justify-between bg-green-950/60 border border-green-800
                   rounded-xl px-4 py-3"
          >
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-sm text-green-300">
                Connected to <span class="font-mono font-bold text-green-200">{{ connectedTo }}</span>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <!-- Voice call button -->
              <button
                @click="startCall(false)"
                :disabled="inCall"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500
                       disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs
                       font-semibold transition"
                title="Voice call"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                       1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0
                       011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716
                       21 3 14.284 3 6V5z" />
                </svg>
                Voice
              </button>
              <!-- Video call button -->
              <button
                @click="startCall(true)"
                :disabled="inCall"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500
                       disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs
                       font-semibold transition"
                title="Video call"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15
                       14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video
              </button>
              <!-- Disconnect -->
              <button
                @click="disconnect"
                class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs
                       font-semibold transition text-gray-300"
              >
                Disconnect
              </button>
            </div>
          </div>
        </Transition>

        <!-- Status message -->
        <p v-if="statusMessage" class="mt-3 text-xs text-gray-500">{{ statusMessage }}</p>
      </section>

      <!-- ── VIDEO GRID (visible during calls) ───────────────────────────── -->
      <Transition name="fade">
        <section v-if="inCall" class="space-y-3">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Live call</h2>

          <!-- Videos -->
          <div
            :class="[
              'grid gap-3',
              callType === 'video' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            ]"
          >
            <!-- Remote video/audio -->
            <div class="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video border border-gray-800">
              <video
                ref="remoteVideoEl"
                autoplay
                playsinline
                :class="callType === 'audio' ? 'invisible' : 'w-full h-full'"
              ></video>
              <!-- Audio-only placeholder -->
              <div
                v-if="callType === 'audio'"
                class="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div class="relative">
                  <div class="absolute inset-0 rounded-full bg-indigo-500/30 animate-pulse-ring"></div>
                  <div class="w-20 h-20 rounded-full bg-indigo-600/30 border-2 border-indigo-500
                               flex items-center justify-center relative">
                    <svg class="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <span class="text-sm text-indigo-300 font-medium">{{ connectedTo }}</span>
              </div>
              <span class="absolute bottom-3 left-3 text-xs bg-black/60 rounded-lg px-2 py-0.5 text-gray-300">
                {{ connectedTo }} (remote)
              </span>
            </div>

            <!-- Local video/audio -->
            <div class="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video border border-gray-800">
              <video
                ref="localVideoEl"
                autoplay
                playsinline
                muted
                :class="(callType === 'audio' || isCameraOff) ? 'invisible' : 'w-full h-full'"
              ></video>
              <!-- Camera-off / audio-only placeholder -->
              <div
                v-if="callType === 'audio' || isCameraOff"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2"
              >
                <div class="w-16 h-16 rounded-full bg-gray-700 border border-gray-600
                             flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500">Camera off</span>
              </div>
              <span class="absolute bottom-3 left-3 text-xs bg-black/60 rounded-lg px-2 py-0.5 text-gray-300">
                You (local)
              </span>
            </div>
          </div>

          <!-- Call controls bar -->
          <div class="flex items-center justify-center gap-4 py-3">
            <!-- Mute toggle -->
            <button
              @click="toggleMute"
              :class="[
                'flex flex-col items-center gap-1 w-16 group',
              ]"
              title="Toggle microphone"
            >
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center transition',
                  isMuted
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                <svg v-if="!isMuted" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0
                       010-6m0 6V3" />
                </svg>
                <svg v-else class="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923
                       3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z
                       M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
              <span class="text-[10px] text-gray-400 group-hover:text-gray-300 transition">
                {{ isMuted ? 'Unmute' : 'Mute' }}
              </span>
            </button>

            <!-- Camera toggle (only for video calls) -->
            <button
              v-if="callType === 'video'"
              @click="toggleCamera"
              class="flex flex-col items-center gap-1 w-16 group"
              title="Toggle camera"
            >
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center transition',
                  isCameraOff
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                <svg v-if="!isCameraOff" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15
                       14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15
                       14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0
                       002 2zM3 3l18 18" />
                </svg>
              </div>
              <span class="text-[10px] text-gray-400 group-hover:text-gray-300 transition">
                {{ isCameraOff ? 'Show cam' : 'Hide cam' }}
              </span>
            </button>

            <!-- End call -->
            <button
              @click="endCall(true)"
              class="flex flex-col items-center gap-1 w-16 group"
              title="End call"
            >
              <div class="w-12 h-12 rounded-full bg-red-700 hover:bg-red-600 flex items-center
                           justify-center transition rotate-[135deg]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                       1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1
                       1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2
                       2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span class="text-[10px] text-gray-400 group-hover:text-gray-300 transition">
                End call
              </span>
            </button>
          </div>
        </section>
      </Transition>

      <!-- ── CHAT PANEL ────────────────────────────────────────────────────── -->
      <Transition name="fade">
        <section
          v-if="connectedTo"
          class="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden"
          style="min-height: 360px; max-height: 520px;"
        >
          <!-- Chat header -->
          <div class="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-sm font-medium text-gray-300">
              Chat with <span class="font-mono text-blue-400">{{ connectedTo }}</span>
            </span>
          </div>

          <!-- Messages -->
          <div
            ref="chatBoxEl"
            class="flex-1 overflow-y-auto px-5 py-4 space-y-3"
          >
            <p
              v-if="messages.length === 0"
              class="text-center text-xs text-gray-600 select-none mt-6"
            >
              No messages yet. Say hello! 👋
            </p>

            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['flex', msg.isOwn ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
                  msg.isOwn
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm',
                ]"
              >
                <p>{{ msg.text }}</p>
                <p
                  :class="[
                    'text-[10px] mt-1 select-none',
                    msg.isOwn ? 'text-blue-200 text-right' : 'text-gray-500'
                  ]"
                >
                  {{ formatTime(msg.timestamp) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Message input -->
          <form
            @submit.prevent="sendMessage"
            class="border-t border-gray-800 px-4 py-3 flex items-center gap-3"
          >
            <input
              v-model="messageInput"
              ref="messageInputEl"
              type="text"
              placeholder="Type a message…"
              class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm
                     placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
              autocomplete="off"
            />
            <button
              type="submit"
              :disabled="!messageInput.trim()"
              class="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                     disabled:cursor-not-allowed rounded-xl transition flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </section>
      </Transition>

      <!-- Empty state when not connected -->
      <Transition name="fade">
        <div
          v-if="!connectedTo"
          class="flex-1 flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div class="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center
                       justify-center mb-2">
            <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
                   20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002
                   5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2
                   0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-gray-400 text-sm max-w-xs">
            Share your <span class="font-mono text-blue-400">{{ myId || '...' }}</span> with a friend,
            then enter their ID above to start chatting or calling.
          </p>
        </div>
      </Transition>

    </main>

    <!-- ════════════════════════════════════════════════════════════════════
         INCOMING CALL MODAL
    ═══════════════════════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="incomingCall"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <div class="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-80 shadow-2xl text-center">
          <!-- Animated ring -->
          <div class="relative inline-flex mb-5">
            <div class="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
            <div class="w-20 h-20 rounded-full bg-gray-800 border-2 border-green-500 flex items-center
                         justify-center relative">
              <svg
                :class="['w-10 h-10 text-green-400', incomingCall.callType === 'audio' ? '' : '']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path
                  v-if="incomingCall.callType === 'audio'"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                     1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0
                     011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716
                     21 3 14.284 3 6V5z" />
                <path
                  v-else
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15
                     14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <p class="text-gray-400 text-sm mb-1">Incoming {{ incomingCall.callType }} call from</p>
          <p class="font-mono text-2xl font-bold text-white mb-6">{{ incomingCall.from }}</p>

          <div class="flex justify-center gap-6">
            <!-- Reject -->
            <button
              @click="rejectCall"
              class="flex flex-col items-center gap-2 group"
            >
              <div class="w-14 h-14 rounded-full bg-red-700 hover:bg-red-600 flex items-center
                           justify-center transition rotate-[135deg]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                       1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0
                       011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716
                       21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span class="text-xs text-gray-400">Decline</span>
            </button>

            <!-- Accept -->
            <button
              @click="acceptCall"
              class="flex flex-col items-center gap-2 group"
            >
              <div class="w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 flex items-center
                           justify-center transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                       1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0
                       011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716
                       21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span class="text-xs text-gray-400">Accept</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── TOAST ────────────────────────────────────────────────────────────── -->
    <Transition name="slide-up">
      <div
        v-if="toast"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-gray-700
               text-sm text-gray-200 px-5 py-3 rounded-xl shadow-xl"
      >
        {{ toast }}
      </div>
    </Transition>

  </div>
</template>

<!-- ══════════════════════════════════════════════════════════════════════════
     SCRIPT SETUP — Vue 3 Composition API
═══════════════════════════════════════════════════════════════════════════ -->
<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';

// ─── Reactive state ───────────────────────────────────────────────────────────

const myId          = ref('');
const friendIdInput = ref('');
const connectedTo   = ref('');
const statusMessage = ref('');
const idCopied      = ref(false);
const toast         = ref('');

// Chat
const messages      = ref([]);   // { text, isOwn, timestamp }
const messageInput  = ref('');
const chatBoxEl     = ref(null);
const messageInputEl= ref(null);

// Call state
const inCall        = ref(false);
const callType      = ref('');    // 'video' | 'audio'
const isMuted       = ref(false);
const isCameraOff   = ref(false);

// Incoming call
const incomingCall  = ref(null);  // { from, offer, callType }

// Video elements
const localVideoEl  = ref(null);
const remoteVideoEl = ref(null);

// Internals (not reactive — no need to track)
let socket          = null;
let peerConnection  = null;
let localStream     = null;
let pendingCandidates = [];

// ─── STUN configuration ───────────────────────────────────────────────────────
const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function showToast(msg, duration = 3000) {
  toast.value = msg;
  setTimeout(() => { toast.value = ''; }, duration);
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function scrollChat() {
  await nextTick();
  if (chatBoxEl.value) {
    chatBoxEl.value.scrollTop = chatBoxEl.value.scrollHeight;
  }
}

// ─── Socket.io setup ─────────────────────────────────────────────────────────

function setupSocket() {
  // In dev the Vite proxy forwards /socket.io → localhost:3000
  // In production pass the backend origin explicitly
  socket = io(window.location.origin, { path: '/socket.io' });

  socket.on('connect', () => {
    statusMessage.value = 'Connected to signaling server.';
  });

  socket.on('disconnect', () => {
    statusMessage.value = 'Disconnected from signaling server.';
  });

  // The server assigns a unique 6-digit ID
  socket.on('your-id', (id) => {
    myId.value = id;
    statusMessage.value = `Your ID is ${id}. Share it with a friend.`;
  });

  socket.on('user-not-found', ({ id }) => {
    showToast(`User ${id} is not online.`);
  });

  // ── Chat ──────────────────────────────────────────────────────────────────
  socket.on('receive-message', ({ from, message, timestamp }) => {
    // Accept messages from the connected peer (or auto-connect if not yet)
    if (!connectedTo.value) connectedTo.value = from;
    messages.value.push({ text: message, isOwn: false, timestamp });
    scrollChat();
  });

  // ── WebRTC signaling ──────────────────────────────────────────────────────
  socket.on('incoming-call', async ({ from, offer, callType: ct }) => {
    // Queue the call
    incomingCall.value = { from, offer, callType: ct };
    // If not already connected to this person, set them as connected
    if (!connectedTo.value) connectedTo.value = from;
  });

  socket.on('call-answered', async ({ answer }) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    // Flush any queued candidates
    for (const c of pendingCandidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
    }
    pendingCandidates = [];
  });

  socket.on('ice-candidate', async ({ candidate }) => {
    if (!candidate) return;
    if (peerConnection && peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
    } else {
      pendingCandidates.push(candidate);
    }
  });

  socket.on('call-rejected', () => {
    showToast('Call was declined.');
    cleanupCall();
  });

  socket.on('call-ended', () => {
    showToast(`${connectedTo.value} ended the call.`);
    cleanupCall();
  });
}

// ─── Connection UI ────────────────────────────────────────────────────────────

function setFriend() {
  const id = friendIdInput.value.trim();
  if (id.length !== 6 || !/^\d{6}$/.test(id)) {
    showToast('Please enter a valid 6-digit ID.');
    return;
  }
  if (id === myId.value) {
    showToast("You can't connect to yourself.");
    return;
  }
  connectedTo.value = id;
  messages.value = [];
  showToast(`Connected to ${id}`);
  nextTick(() => messageInputEl.value?.focus());
}

function disconnect() {
  if (inCall.value) endCall(true);
  connectedTo.value = '';
  messages.value = [];
  friendIdInput.value = '';
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !connectedTo.value) return;
  const timestamp = new Date().toISOString();
  socket.emit('send-message', { to: connectedTo.value, message: text });
  messages.value.push({ text, isOwn: true, timestamp });
  messageInput.value = '';
  scrollChat();
}

// ─── WebRTC ───────────────────────────────────────────────────────────────────

function createPeerConnection(targetId) {
  const pc = new RTCPeerConnection(RTC_CONFIG);

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      socket.emit('ice-candidate', { to: targetId, candidate });
    }
  };

  pc.ontrack = (event) => {
    if (remoteVideoEl.value && event.streams[0]) {
      remoteVideoEl.value.srcObject = event.streams[0];
    }
  };

  pc.oniceconnectionstatechange = () => {
    if (['disconnected', 'failed', 'closed'].includes(pc.iceConnectionState)) {
      if (inCall.value) {
        showToast('Connection lost.');
        cleanupCall();
      }
    }
  };

  return pc;
}

async function startCall(withVideo) {
  if (!connectedTo.value) { showToast('Connect to a friend first.'); return; }
  if (inCall.value) return;

  callType.value = withVideo ? 'video' : 'audio';

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: withVideo,
      audio: true,
    });
  } catch (err) {
    showToast(`Media access denied: ${err.message}`);
    return;
  }

  // Mark call active BEFORE touching refs so v-if renders the <video> elements
  inCall.value = true;
  isMuted.value = false;
  isCameraOff.value = false;

  await nextTick(); // wait for <video> elements to mount
  if (localVideoEl.value) localVideoEl.value.srcObject = localStream;

  peerConnection = createPeerConnection(connectedTo.value);
  localStream.getTracks().forEach((t) => peerConnection.addTrack(t, localStream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit('call-user', {
    to: connectedTo.value,
    offer: peerConnection.localDescription,
    callType: callType.value,
  });
}

async function acceptCall() {
  const { from, offer, callType: ct } = incomingCall.value;
  incomingCall.value = null;
  callType.value = ct;

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: ct === 'video',
      audio: true,
    });
  } catch (err) {
    showToast(`Media access denied: ${err.message}`);
    return;
  }

  // Mark call active BEFORE touching refs so v-if renders the <video> elements
  inCall.value = true;
  isMuted.value = false;
  isCameraOff.value = false;

  await nextTick(); // wait for <video> elements to mount
  if (localVideoEl.value) localVideoEl.value.srcObject = localStream;

  peerConnection = createPeerConnection(from);
  localStream.getTracks().forEach((t) => peerConnection.addTrack(t, localStream));

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // Flush queued candidates now that remote description is set
  for (const c of pendingCandidates) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
  }
  pendingCandidates = [];

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit('answer-call', { to: from, answer: peerConnection.localDescription });
}

function rejectCall() {
  if (incomingCall.value) {
    socket.emit('reject-call', { to: incomingCall.value.from });
    incomingCall.value = null;
  }
}

function endCall(notify = true) {
  if (notify && connectedTo.value) {
    socket.emit('end-call', { to: connectedTo.value });
  }
  cleanupCall();
}

function cleanupCall() {
  localStream?.getTracks().forEach((t) => t.stop());
  localStream = null;
  peerConnection?.close();
  peerConnection = null;
  pendingCandidates = [];

  if (localVideoEl.value)  localVideoEl.value.srcObject  = null;
  if (remoteVideoEl.value) remoteVideoEl.value.srcObject = null;

  inCall.value     = false;
  callType.value   = '';
  isMuted.value    = false;
  isCameraOff.value= false;
}

// ─── Call controls ────────────────────────────────────────────────────────────

function toggleMute() {
  if (!localStream) return;
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    isMuted.value = !audioTrack.enabled;
  }
}

function toggleCamera() {
  if (!localStream) return;
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    isCameraOff.value = !videoTrack.enabled;
  }
}

// ─── Header helpers ───────────────────────────────────────────────────────────

async function copyId() {
  if (!myId.value) return;
  try {
    await navigator.clipboard.writeText(myId.value);
    idCopied.value = true;
    setTimeout(() => { idCopied.value = false; }, 2000);
  } catch {
    showToast('Could not copy — please copy manually.');
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  setupSocket();
});

onBeforeUnmount(() => {
  cleanupCall();
  socket?.disconnect();
});
</script>

<!-- ══════════════════════════════════════════════════════════════════════════
     TRANSITIONS
═══════════════════════════════════════════════════════════════════════════ -->
<style scoped>
/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* Slide down (banner) */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 120px;
}

/* Slide up (toast) */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to       { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
