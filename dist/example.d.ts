/// <reference types="node" />
import { AnyMessageContent } from "@adiwajshing/baileys";
export declare const startSock: () => Promise<{
    getOrderDetails: (orderId: string, tokenBase64: string) => Promise<import("@adiwajshing/baileys").OrderDetails>;
    getCatalog: ({ jid, limit, cursor }: import("@adiwajshing/baileys").GetCatalogOptions) => Promise<{
        products: import("@adiwajshing/baileys").Product[];
        nextPageCursor: string;
    }>;
    getCollections: (jid?: string, limit?: number) => Promise<{
        collections: import("@adiwajshing/baileys").CatalogCollection[];
    }>;
    productCreate: (create: import("@adiwajshing/baileys").ProductCreate) => Promise<import("@adiwajshing/baileys").Product>;
    productDelete: (productIds: string[]) => Promise<{
        deleted: number;
    }>;
    productUpdate: (productId: string, update: import("@adiwajshing/baileys").ProductUpdate) => Promise<import("@adiwajshing/baileys").Product>;
    sendMessageAck: ({ tag, attrs }: import("@adiwajshing/baileys").BinaryNode) => Promise<void>;
    sendRetryRequest: (node: import("@adiwajshing/baileys").BinaryNode, forceIncludeKeys?: boolean) => Promise<void>;
    rejectCall: (callId: string, callFrom: string) => Promise<void>;
    getPrivacyTokens: (jids: string[]) => Promise<import("@adiwajshing/baileys").BinaryNode>;
    assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
    relayMessage: (jid: string, message: import("@adiwajshing/baileys").proto.IMessage, { messageId: msgId, participant, additionalAttributes, useUserDevicesCache, cachedGroupMetadata }: import("@adiwajshing/baileys").MessageRelayOptions) => Promise<string>;
    sendReceipt: (jid: string, participant: string, messageIds: string[], type: import("@adiwajshing/baileys").MessageReceiptType) => Promise<void>;
    sendReceipts: (keys: import("@adiwajshing/baileys").proto.IMessageKey[], type: import("@adiwajshing/baileys").MessageReceiptType) => Promise<void>;
    readMessages: (keys: import("@adiwajshing/baileys").proto.IMessageKey[]) => Promise<void>;
    refreshMediaConn: (forceGet?: boolean) => Promise<import("@adiwajshing/baileys").MediaConnInfo>;
    waUploadToServer: import("@adiwajshing/baileys").WAMediaUploadFunction;
    fetchPrivacySettings: (force?: boolean) => Promise<{
        [_: string]: string;
    }>;
    updateMediaMessage: (message: import("@adiwajshing/baileys").proto.IWebMessageInfo) => Promise<import("@adiwajshing/baileys").proto.IWebMessageInfo>;
    sendMessage: (jid: string, content: AnyMessageContent, options?: import("@adiwajshing/baileys").MiscMessageGenerationOptions) => Promise<import("@adiwajshing/baileys").proto.WebMessageInfo>;
    groupMetadata: (jid: string) => Promise<import("@adiwajshing/baileys").GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<import("@adiwajshing/baileys").GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: import("@adiwajshing/baileys").ParticipantAction) => Promise<{
        status: string;
        jid: string;
    }[]>;
    groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string>;
    groupRevokeInvite: (jid: string) => Promise<string>;
    groupAcceptInvite: (code: string) => Promise<string>;
    groupAcceptInviteV4: (key: string | import("@adiwajshing/baileys").proto.IMessageKey, inviteMessage: import("@adiwajshing/baileys").proto.Message.IGroupInviteMessage) => Promise<string>;
    groupGetInviteInfo: (code: string) => Promise<import("@adiwajshing/baileys").GroupMetadata>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: import("@adiwajshing/baileys").GroupMetadata;
    }>;
    processingMutex: {
        mutex<T>(code: () => T | Promise<T>): Promise<T>;
    };
    upsertMessage: (msg: import("@adiwajshing/baileys").proto.IWebMessageInfo, type: import("@adiwajshing/baileys").MessageUpsertType) => Promise<void>;
    appPatch: (patchCreate: import("@adiwajshing/baileys").WAPatchCreate) => Promise<void>;
    sendPresenceUpdate: (type: import("@adiwajshing/baileys").WAPresence, toJid?: string) => Promise<void>;
    presenceSubscribe: (toJid: string, tcToken?: Buffer) => Promise<void>;
    profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number) => Promise<string>;
    onWhatsApp: (...jids: string[]) => Promise<{
        exists: boolean;
        jid: string;
    }[]>;
    fetchBlocklist: () => Promise<string[]>;
    fetchStatus: (jid: string) => Promise<{
        status: string;
        setAt: Date;
    }>;
    updateProfilePicture: (jid: string, content: import("@adiwajshing/baileys").WAMediaUpload) => Promise<void>;
    updateProfileStatus: (status: string) => Promise<void>;
    updateProfileName: (name: string) => Promise<void>;
    updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
    getBusinessProfile: (jid: string) => Promise<void | import("@adiwajshing/baileys").WABusinessProfile>;
    resyncAppState: (collections: readonly ("critical_block" | "critical_unblock_low" | "regular_high" | "regular_low" | "regular")[], isInitialSync: boolean) => Promise<void>;
    chatModify: (mod: import("@adiwajshing/baileys").ChatModification, jid: string) => Promise<void>;
    type: "md";
    ws: any;
    ev: import("@adiwajshing/baileys").BaileysEventEmitter & {
        process(handler: (events: Partial<import("@adiwajshing/baileys").BaileysEventMap>) => void | Promise<void>): () => void;
        buffer(): void;
        createBufferedFunction<A extends any[], T_1>(work: (...args: A) => Promise<T_1>): (...args: A) => Promise<T_1>;
        flush(force?: boolean): boolean;
        isBuffering(): boolean;
    };
    authState: {
        creds: import("@adiwajshing/baileys").AuthenticationCreds;
        keys: import("@adiwajshing/baileys").SignalKeyStoreWithTransaction;
    };
    user: import("@adiwajshing/baileys").Contact;
    generateMessageTag: () => string;
    query: (node: import("@adiwajshing/baileys").BinaryNode, timeoutMs?: number) => Promise<import("@adiwajshing/baileys").BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Buffer | Uint8Array) => Promise<void>;
    sendNode: (frame: import("@adiwajshing/baileys").BinaryNode) => Promise<void>;
    logout: (msg?: string) => Promise<void>;
    end: (error: Error) => void;
    onUnexpectedError: (error: Error, msg: string) => void;
    uploadPreKeys: (count?: number) => Promise<void>;
    uploadPreKeysToServerIfRequired: () => Promise<void>;
    waitForConnectionUpdate: (check: (u: Partial<import("@adiwajshing/baileys").ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}>;
